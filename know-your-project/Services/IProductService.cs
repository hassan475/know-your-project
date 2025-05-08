using know_your_project.Common;
using Microsoft.AspNetCore.Mvc;

namespace know_your_project.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProducts();

        Task<Product> GetProductById(string id);

        Task<HttpResponseMessage> UpdateProduct(Product product);
    }
}
