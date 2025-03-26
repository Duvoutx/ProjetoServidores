using Microsoft.EntityFrameworkCore;
using ServidoresAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte a controllers
builder.Services.AddControllers();

// Configuração do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=servidores.db"));

// 🔥 Registra o ServidorRepository para ser injetado nos controllers
builder.Services.AddScoped<ServidorRepository>();

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()  // Permite qualquer método HTTP
              .AllowAnyHeader()
              .AllowCredentials();  // Permite credenciais (se necessário)
    });
});

// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngularOrigins");

// Configuração do pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Ativa o roteamento e autorização

app.UseRouting();
app.UseAuthorization();
app.MapControllers(); // 🔥 Isso é essencial para os controllers funcionarem!

app.Run();
