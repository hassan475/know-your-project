using Azure;
using Azure.Data.Tables;
using know_your_project.Common;
using System.Net;

namespace know_your_project.Services
{
    public class ProductService: IProductService
    {
        private readonly TableClient tableClient;
        public ProductService() 
        {
            tableClient = new TableClient("DefaultEndpointsProtocol=https;AccountName=purchaseorderapi;AccountKey=CFU9MPmyS3WaTVv4YJwg83jU4tcZjB0Ak/c2wkqu8tiPYLuB3PVAzHHrA+1ojRMqbqEZIWhmKCtMfEclIY3yGA==;EndpointSuffix=core.windows.net", "Product");
        }

        public async Task<IEnumerable<Product>> GetProducts() 
        {           
            var Products = new List<Product>(); 
            await foreach (var entity in tableClient.QueryAsync<Product>())
            {
                Products.Add(entity);
            }
            return Products;
        }

        public async Task<Product> GetProductById(string id)
        {
            string filter = TableClient.CreateQueryFilter<Product>(
            e => e.ProductId == id );
            Pageable<Product> products = tableClient.Query<Product>(filter:filter);

            foreach (Product entity in products)
            {
                return entity;
            }
            return null;
        }

        public async Task<HttpResponseMessage> UpdateProduct(Product product)
        {
            var qProduct = await tableClient.GetEntityIfExistsAsync<Product>(product.PartitionKey, product.RowKey);

            if (qProduct != null)
            {
                var response = await tableClient.UpdateEntityAsync<Product>(product, product.ETag);

                if (response.Status == 204)
                    return new HttpResponseMessage(HttpStatusCode.OK);
                else
                    return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            else
              return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }
    }
}
