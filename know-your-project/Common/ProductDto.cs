namespace know_your_project.Common
{
    public class ProductDto
    {
        public string ProductID { get; set; }
        public string Description { get; set; }
        public double Weight { get; set; }
        public double Price { get; set; }
        public string Notes { get; set; }
    }

    // Models/KeywordRequest.cs
    public class KeywordRequest
    {
        public string Query { get; set; }
    }

    // Models/KeywordResponse.cs
    public class KeywordResponse
    {
        public List<string> Keywords { get; set; } = new();
    }

    public class ChatResponse
    {
        public List<Choice>? Choices { get; set; }
    }
    public class Choice
    {
        public Message? Message { get; set; }
    }
    public class Message
    {
        public string? Role { get; set; }
        public string? Content { get; set; }
    }
}
