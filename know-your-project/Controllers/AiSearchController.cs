// Controllers/AiSearchController.cs
using know_your_project.Common;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class AiSearchController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AiSearchController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
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

        return Ok(keywords);
    }
}
