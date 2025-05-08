using Azure;
using Azure.Data.Tables;

namespace know_your_project.Common
{
    public class Product: ITableEntity
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public DateTimeOffset? Timestamp { get; set; }
        public string ProductId { get; set; }
        public string Description { get; set; }
        public double Weight { get; set; }
        public double Price { get; set; }
        public string Notes { get; set; }
        public ETag ETag { get; set; }
    }
}
