using infrastructure.DataModels;
using infrastructure.Repositories;
using Microsoft.Extensions.Logging;
using service.Models.Command;
using service.Password;

namespace service;

public class AccountService
{
    private readonly ILogger<AccountService> _logger;
    private readonly PasswordHashRepository _passwordHashRepository;
    private readonly UserRepository _userRepository;

    public AccountService(ILogger<AccountService> logger, UserRepository userRepository,
        PasswordHashRepository passwordHashRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
        _passwordHashRepository = passwordHashRepository;
    }
    
    

    
    
    // Calls the create method with the name of hash algorithm stored on user row in db
    // Allows us to easily implement support for a new password hashing algorithm
    // 
    //  if the credentials can not be verified for some reason - whether email doesn't exist, 
    // password is incorrect or an exception is thrown - it is important that we always "fail" in the same way.
    // In this case: if credentials can't be verified, we return null, no matter the cause.
    public User? Authenticate(LoginCommandModel model)
    {
        try
        {
            var passwordHash = _passwordHashRepository.GetByEmail(model.Email);
            var hashAlgorithm = PasswordHashAlgorithm.Create(passwordHash.Algorithm);
            var isValid = hashAlgorithm.VerifyHashedPassword(model.Password, passwordHash.Hash, passwordHash.Salt);
            if (isValid) return _userRepository.GetById(passwordHash.UserId);
        }
        catch (Exception e)
        {
            _logger.LogError("Authentication error: {Message}", e);
        }

        return null;
    }
    
    
    public User Register(RegisterCommandModel model)
    {
        var hashAlgorithm = PasswordHashAlgorithm.Create();
        var salt = hashAlgorithm.GenerateSalt();
        var hash = hashAlgorithm.HashPassword(model.Password, salt);
        var user = _userRepository.Create(model.FullName, model.Email);
        _passwordHashRepository.Create(user.Id, hash, salt, hashAlgorithm.GetName());
        return user;
    }
    
    public User? Get(SessionData data)
    {
        return _userRepository.GetById(data.UserId);
    }

    public User Update(SessionData data, UpdateAccountCommandModel model, string? avatarUrl)
    {
        return _userRepository.Update(data.UserId, model.FullName, model.Email, avatarUrl);
    }
}