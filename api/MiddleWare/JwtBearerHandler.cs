﻿using service;

namespace api.MiddleWare;

public class JwtBearerHandler
{
    
    // This class is used to parse the header of a given HTTP request and extract our token
    
    private readonly ILogger<JwtBearerHandler> _logger;
    private readonly RequestDelegate _next;

    public JwtBearerHandler(ILogger<JwtBearerHandler> logger, RequestDelegate next)
    {
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext http)
    {
        var jwtHelper = http.RequestServices.GetRequiredService<JwtService>();

        try
        {
            var authHeader = http.Request.Headers.Authorization.FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Split(" ")[1];
                var data = jwtHelper.ValidateAndDecodeToken(token);
                http.SetSessionData(data);
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error extracting user from bearer token in Authorization header");
        }

        await _next.Invoke(http);
    }
}