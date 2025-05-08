// Controllers/AiSearchController.cs
using know_your_project.Common;
using know_your_project.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class AiSearchController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IProductService _productService;

    public AiSearchController(IHttpClientFactory httpClientFactory, IProductService productService)
    {
        _httpClientFactory = httpClientFactory;
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> Extract([FromBody] KeywordRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Query))
            return BadRequest("Query cannot be empty.");

        var systemMsg = @"You are a helpful assistant that extracts the few most relevant keywords
                          from the user’s search query. Return a JSON array of lowercase keyword
                          strings, and nothing else.";

        var gptRequest = new
        {
            model = "gpt-4",
            messages = new[]
            {
                new { role = "system", content = systemMsg.Trim() },
                new { role = "user",   content = req.Query }
            },
            max_tokens = 200,
            temperature = 0.0m
        };

        // 1) Send the HTTP POST to chat/completions
        var client = _httpClientFactory.CreateClient("OpenAI");
        // note: BaseAddress is https://api.openai.com/v1/
        var response = await client.PostAsJsonAsync("chat/completions", gptRequest);
        response.EnsureSuccessStatusCode();

        // 2) Read & parse the ChatResponse
        var chat = await response.Content.ReadFromJsonAsync<ChatResponse>();
        var contentStr = chat?
            .Choices?
            .FirstOrDefault()?
            .Message?
            .Content
          ?? throw new InvalidOperationException("No content from OpenAI");

        // 3) Now parse that string as JSON array of keywords
        var keywords = JsonSerializer.Deserialize<List<string>>(contentStr,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? new List<string>();


        // 2) Fetch ALL products (or a base set) from your service
        var allProducts = await _productService.GetProducts();

        // 3) Filter in‐memory by matching ANY keyword against Description or Notes
        var filtered = allProducts
                  .Where(p =>
                  {
                      bool textMatch = keywords.Any(kw =>
                        (!string.IsNullOrEmpty(p.Description) &&
                          p.Description.Contains(kw, StringComparison.OrdinalIgnoreCase))
                        || (!string.IsNullOrEmpty(p.Notes) &&
                          p.Notes.Contains(kw, StringComparison.OrdinalIgnoreCase))
                      );

                      // if ANY keyword parses to a number, treat it as a max price or max weight
                      bool numberMatch = keywords
                        .Select(kw => double.TryParse(kw, out var num) ? (double?)num : null)
                        .Where(n => n.HasValue)
                        .Any(n => p.Price <= n.Value || p.Weight <= n.Value);

                      return textMatch || numberMatch;
                  })
                  .ToList();


        // 4) Return the filtered list
        return Ok(filtered);
    }
}
