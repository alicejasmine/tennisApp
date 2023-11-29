using api;
using api.MiddleWare;
using infrastructure;
using infrastructure.Repositories;
using service;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.ClearProviders();
builder.Logging.AddConsole();


// Add services to the container.

builder.Services.AddNpgsqlDataSource(Utilities.ProperlyFormattedConnectionString,
    dataSourceBuilder => dataSourceBuilder.EnableParameterLogging());

builder.Services.AddSingleton<ShotsRepository>();
builder.Services.AddSingleton<ShotService>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<PasswordHashRepository>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<AccountService>();
builder.Services.AddJwtService();
builder.Services.AddSwaggerGenWithBearerJWT();



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var frontEndRelativePath = "./../frontend/www";
builder.Services.AddSpaStaticFiles(conf => conf.RootPath = frontEndRelativePath);
var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSecurityHeaders();

var frontendOrigin = app.Services.GetService<IConfiguration>()!["FrontendOrigin"];
app.UseCors(policy =>
    policy
        .SetIsOriginAllowed(origin => origin == frontendOrigin)
        .AllowAnyMethod()
        .AllowAnyHeader()
);

app.UseSpaStaticFiles();
app.UseSpa(conf => { conf.Options.SourcePath = frontEndRelativePath; });

app.MapControllers();
app.UseMiddleware<JwtBearerHandler>();
app.UseMiddleware<GlobalExceptionHandler>();
app.Run();
