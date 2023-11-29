using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace service;


public class JwtOptions
{
    // These are the options for creating and signing a token that we are making configurable
    // So that we can use different values in development vs deployed.
    public required byte[] Secret { get; init; }
    public required TimeSpan Lifetime { get; init; }
    public string? Address { get; set; }
}

public class JwtService
{
    private readonly JwtOptions _options;

    // Since the options are taken as a constructor parameter
    // the options should be loaded from the configuration file (
    // We also want to be able to dependency inject the JwtService where needed.
    public JwtService(JwtOptions options)
    {
        _options = options;
    }

    private const string Algorithm = SecurityAlgorithms.HmacSha512;
    
    
    // Here Issuer and Audience is the same,
    // because we are going to both issue the token and consumed (audience) from the same system.
    //
    // Expires is when the token is valid until.
    // Claims are the payload of the token. We can store whatever information we want in claims. But we should stay away from storing sensitive information in it, since it isn't encrypted.
    public string IssueToken(SessionData data)
    {
        var jwtHandler = new JwtSecurityTokenHandler();
        var token = jwtHandler.CreateEncodedJwt(new SecurityTokenDescriptor
        {
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(_options.Secret),
                Algorithm
            ),
            Issuer = _options.Address,
            Audience = _options.Address,
            Expires = DateTime.UtcNow.Add(_options.Lifetime),
            Claims = data.ToDictionary()
        });
        return token;
    }

    // validate and extract the payload from the token again
    // only accepts tokens signed by the one algorithm our application is using
    public SessionData ValidateAndDecodeToken(string token)
    {
        var jwtHandler = new JwtSecurityTokenHandler();
        var principal = jwtHandler.ValidateToken(token, new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(_options.Secret),
            ValidAlgorithms = new[] { Algorithm },

            
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateLifetime = true,

            ValidAudience = _options.Address,
            ValidIssuer = _options.Address,

            // Set to 0 when validating on the same system that created the token
            ClockSkew = TimeSpan.FromSeconds(0)
        }, out var securityToken);
        return SessionData.FromDictionary(new JwtPayload(principal.Claims));
    }
}