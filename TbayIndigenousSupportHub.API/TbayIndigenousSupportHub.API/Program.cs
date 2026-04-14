using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using TbayIndigenousSupportHub.API.Data;
using TbayIndigenousSupportHub.API.Services;
using TbayIndigenousSupportHub.API.Models;
using TbayIndigenousSupportHub.API.Interfaces;
using TbayIndigenousSupportHub.API.Repositories;
using System.Linq;



var builder = WebApplication.CreateBuilder(args);


var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
    options.TokenValidationParameters = new TokenValidationParameters

    {   ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "STAY_SECRET_KEY_2026_DEFAULT"))
    };

 });



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by your token. Example: Bearer eyJhbGciOiJIUzI1NiIs..."
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});



builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

builder.Services.AddScoped<EmailService>();

// Repositories
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();

// Services
builder.Services.AddScoped<IBusinessService, BusinessService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IHubService, HubService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IChatbotService, ChatbotService>();
builder.Services.AddScoped<SearchService>();

builder.Services.Configure<GeminiSettings>(builder.Configuration.GetSection("GeminiSettings"));
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policyBuilder =>
        {
            

            policyBuilder.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseMiddleware<TbayIndigenousSupportHub.API.Middleware.ExceptionMiddleware>();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{ }
    app.UseSwagger();
    app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Automatically apply migrations and create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }

    // 0. Seed Filter Options
    if (!db.FilterOptions.Any())
    {
        var initialFilters = new List<FilterOption>();

        // Service Categories
        string[] sCats = { "Mental Health Services", "Healthcare & Clinics", "Cultural & Community Support", "Housing & Shelter Support", "Education & Training", "Employment & Career Services", "Youth Services", "Family & Social Support", "Legal & Advocacy Services", "Emergency & Crisis Support" };
        initialFilters.AddRange(sCats.Select(c => new FilterOption { Name = c, FilterType = "Category", EntityType = "Service" }));

        // Service Types
        string[] sTypes = { "Native-Led", "Community Centre", "Clinic", "Shelter", "School", "Legal Clinic" };
        initialFilters.AddRange(sTypes.Select(t => new FilterOption { Name = t, FilterType = "Type", EntityType = "Service" }));

        // Business Categories
        string[] bCats = { "Indigenous Owned", "Arts & Culture", "Retail", "Services", "Food" };
        initialFilters.AddRange(bCats.Select(c => new FilterOption { Name = c, FilterType = "Category", EntityType = "Business" }));

        db.FilterOptions.AddRange(initialFilters);
        db.SaveChanges();
    }

    // Seed Data - Services (Detailed)
    if (!db.Services.Any(s => s.ServiceName == "Anishnawbe Mushkiki" && s.Latitude != null))
    {
        db.Services.AddRange(new List<Service>
        {
            // 1. Mental Health Services
            new Service { ServiceName = "Anishnawbe Mushkiki", Category = "Mental Health Services", Description = "Mental health counseling, Traditional healing, Cultural support, Community wellness programs.", Address = "1260 Golf Links Rd, 3rd Floor, Thunder Bay, ON P7B 0A1", Phone = "(807) 623-0383", Email = "info@mushkiki.com", Website = "https://mushkiki.com/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4237, Longitude = -89.2711 },
            new Service { ServiceName = "Thunder Bay Indigenous Friendship Centre", Category = "Mental Health Services", Description = "Indigenous counseling services, Elder support, Healing circles, Cultural programming.", Address = "401 Cumberland St N, Thunder Bay, ON", Phone = "(807) 345-5840", Website = "https://tbifc.ca", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4064, Longitude = -89.2393 },
            
            // 2. Healthcare & Clinics
            new Service { ServiceName = "NorWest Community Health Centres", Category = "Healthcare & Clinics", Description = "Primary healthcare, Indigenous health programs, Mental health services, Outreach & harm reduction.", Address = "525 Simpson Street, Thunder Bay, ON P7C 3J6", Phone = "(807) 622-8235", Website = "https://norwestchc.org/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.3900, Longitude = -89.2415 },
            new Service { ServiceName = "Dilico Anishinabek Family Care", Category = "Healthcare & Clinics", Description = "Indigenous health & wellness, Child & family services, Mental health programs.", Address = "17 Court Street South Thunder Bay, ON, P7B 0E8", Phone = "(807) 626-5100", Website = "https://www.dilico.com/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4111, Longitude = -89.2312 },
            
            // 3. Cultural & Community Support
            new Service { ServiceName = "Fort William First Nation", Category = "Cultural & Community Support", Description = "Cultural programs, Community events, Traditional healing connections.", Website = "https://fwfn.com/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.3475, Longitude = -89.2561 },
            
            // 4. Housing & Shelter Support
            new Service { ServiceName = "Matawa First Nations Management", Category = "Housing & Shelter Support", Description = "Housing coordination, Community housing advocacy, Support services.", Address = "233 Court St S, Thunder Bay, ON P7B 2X9", Phone = "(807) 344-4575", Website = "https://www.matawa.on.ca/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4105, Longitude = -89.2325 },
            new Service { ServiceName = "Shelter House Thunder Bay", Category = "Housing & Shelter Support", Description = "Emergency shelter, Outreach support, Indigenous-inclusive services.", Address = "420 George St, Thunder Bay, ON P7E 5Y8", Phone = "(807) 623-8182", Website = "https://www.shelterhouse.on.ca/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.3846, Longitude = -89.2483 },
            
            // 5. Education & Training
            new Service { ServiceName = "Confederation College", Category = "Education & Training", Description = "Indigenous student support, Skills training, Adult education.", Address = "1450 Nakina Drive, Thunder Bay, ON P7B 0E5", Phone = "(807) 475-6110", Website = "https://www.confederationcollege.ca/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4035, Longitude = -89.2690 },
            new Service { ServiceName = "Lakehead University", Category = "Education & Training", Description = "Indigenous Initiatives Office, Student support programs, Cultural programming.", Address = "955 Oliver Rd, Thunder Bay, ON, P7B 5E1", Phone = "(807) 343.8110", Email = "tbay@lakeheadu.ca", Website = "https://www.lakeheadu.ca/indigenous", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4219, Longitude = -89.2589 },
            
            // 6. Employment & Career Services
            new Service { ServiceName = "Ontario Works - Thunder Bay", Category = "Employment & Career Services", Description = "Job readiness support, Employment assistance, Financial support programs.", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.3754, Longitude = -89.2415 },
            
            // 7. Youth Services
            new Service { ServiceName = "Boys and Girls Club of Thunder Bay", Category = "Youth Services", Description = "Youth programs, After-school support, Leadership programs.", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4358, Longitude = -89.2215 },
            
            // 8. Family & Social Support
            new Service { ServiceName = "Thunder Bay District Health Unit", Category = "Family & Social Support", Description = "Family wellness, Parenting programs, Community outreach.", Address = "999 Balmoral St, Thunder Bay, ON P7B 6E7", Phone = "(807) 625-5900", Website = "https://www.tbdhu.com/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.3995, Longitude = -89.2550 },
            
            // 9. Legal & Advocacy Services
            new Service { ServiceName = "Kinna-aweya Legal Clinic", Category = "Legal & Advocacy Services", Description = "Legal advocacy, Indigenous legal support, Housing & social assistance representation.", Address = "86 Cumberland St S, Thunder Bay, ON P7B 2V3", Phone = "(807) 344-2478", Website = "https://www.kalc.ca/", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4068, Longitude = -89.2384 },
            
            // 10. Emergency & Crisis Support
            new Service { ServiceName = "Beendigen", Category = "Emergency & Crisis Support", Description = "Crisis support, Shelter for Indigenous women, Family violence prevention.", Location = "Thunder Bay, ON", IsActive = true, Latitude = 48.4012, Longitude = -89.2445 }
        });
    }

    // Migration Fix: Ensure Address/Location are correctly separated for all services
    var allServices = db.Services.ToList();
    foreach (var s in allServices)
    {
        // If Address is empty but Location looks like an address (contains comma/numbers)
        if (string.IsNullOrEmpty(s.Address) && !string.IsNullOrEmpty(s.Location) && (s.Location.Any(char.IsDigit) || s.Location.Contains(",")))
        {
            s.Address = s.Location;
            s.Location = "Thunder Bay, ON";
        }
    }
    db.SaveChanges();

    var adminEmail = "sumit17124@gmail.com";
    var user = db.Users.FirstOrDefault(u => u.Email == adminEmail);
    var hasher = new PasswordHasher<User>();

    if (user == null)
    {
        user = new User
        {
            FullName = "System Admin",
            Email = adminEmail,
            Role = "Admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = hasher.HashPassword(user, "Admin@123");
        db.Users.Add(user);
    }
    else
    {
        user.PasswordHash = hasher.HashPassword(user, "Admin@123");
        user.Role = "Admin";
        user.IsActive = true;
    }
    db.SaveChanges();
}

app.MapControllers();

app.Run();
