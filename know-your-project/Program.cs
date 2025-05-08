using know_your_project.Services;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

//Add CORS services and define a policy that allows any origin, method, and header:
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Program.cs (inside builder configuration)
builder.Services.AddHttpClient("OpenAI", client =>
{
    client.BaseAddress = new Uri("https://api.openai.com/v1/");
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "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");
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IProductService, ProductService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("AllowAll");


app.MapControllers();

app.Run();
