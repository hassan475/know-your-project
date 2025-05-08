using know_your_project.Common;
using know_your_project.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace know_your_project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> _logger;
        private readonly IProductService _productService;

        public ProductController(ILogger<ProductController> logger, IProductService productService)
        {
            _logger = logger;
            _productService = productService;
        }

        [HttpPost("/UpdateProduct")]
        public async Task<HttpResponseMessage> SaveProductdetails([FromBody] Product product, CancellationToken cancellationToken)
        {
            if (product == null || product.ProductId == null) return new HttpResponseMessage(HttpStatusCode.BadRequest);
            return await _productService.UpdateProduct(product);
        }

        [HttpGet("/GetProducts")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts() 
        {
            var products = await _productService.GetProducts();
            return products.ToList();
        }

        [HttpGet("/GetProduct/{productId}")]
        public async Task<ActionResult<Product>> GetProductdetails(string productId) 
        {
            var product = await _productService.GetProductById(productId);
            if (product == null) return BadRequest();
            return product;
        }
    }
}
