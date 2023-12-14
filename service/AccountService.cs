using System.ComponentModel.DataAnnotations;
using infrastructure.DataModels;
using infrastructure.Repositories;
using Microsoft.Extensions.Logging;
using service.Models.Command;
using service.Password;

namespace service;

public class AccountService
{
    
    // Account management tasks, such as registration, authentication, password-resets etc
    // are delegated to this class.
    
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
    
    // Used to register a new account
    // since anyone can register an account we will be defaulting new users without admin status
    public User Register(RegisterCommandModel model)
    {
        const int fakeId = 0; // since we are creating we have no id, so we will pass a fake one.
        const bool isCreate = true; // Since we are creating a new user, this is true. If set to false, create will use fakeId to check email.

        var fullName = model.FullName;
        var email = model.Email;
        var isAdmin = model.IsAdmin;
        
        try
        {
            if (_userRepository.IsEmailTaken(fakeId, email, isCreate))
                throw new ValidationException("Email is taken, please choose another.");

            var hashAlgorithm = PasswordHashAlgorithm.Create();
            var salt = hashAlgorithm.GenerateSalt();
            var hash = hashAlgorithm.HashPassword(model.Password, salt);
            var user = _userRepository.Create(fullName, email, isAdmin);
            _passwordHashRepository.Create(user.Id, hash, salt, hashAlgorithm.GetName());
            return user;
        }
        catch (ValidationException e)
        {
            _logger.LogError("Validation error: {Message}", e);
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        catch (Exception e)
        {
            _logger.LogError("User creation error: {Message}", e);
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw; 
        }
    }
    
    public User? Get(SessionData data)
    {
        return _userRepository.GetById(data.UserId);
    }
    
    // This will be used when a user updates their own account 
    public User Update(SessionData data, UpdateAccountCommandModel model)
    {
        var userId = data.UserId; // Id of our user
        var fullname = model.FullName; // full name of our user
        var email = model.Email; // email of user
        var isAdmin = data.IsAdmin; // true if user is admin
        var isCreate = false; // since we are updating this is false 
        
        try
        {
            if (_userRepository.IsEmailTaken(userId, email, isCreate))
                throw new ValidationException("Email is taken, please choose another.");
            return _userRepository.Update(userId, fullname, email, isAdmin);
        }
        catch (ValidationException e)
        {
            _logger.LogError("Validation error: {Message}", e);
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        catch (Exception e)
        {
            _logger.LogError("User creation error: {Message}", e);
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        
    }
}