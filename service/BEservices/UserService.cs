using System.ComponentModel.DataAnnotations;
using infrastructure.DataModels;
using infrastructure.Repositories;
using Microsoft.Extensions.Logging;
using service.Models.Command;
using service.Models.Query;

namespace service.BEservices;

public class UserService
{
    private readonly ILogger<UserService> _logger;
    private readonly UserRepository _userRepository;
    
    public UserService(UserRepository userRepository, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }
    
    // While anyone can register an account, we assume create will be used to create an account for someone else
    // because of this, unlike register we will NOT be assuming the user is not an admin
    // So, we need to know if they will be.
    public User Create(CreateUserCommandModel model)
    {
        const int fakeId = 0; // a new user will not have an id, irrelevant if isCreate is true.
        const bool isTrue = true; // true when creating a new user, which we are.
        
        try
        {
            if (_userRepository.IsEmailTaken(fakeId, model.Email, isTrue))
                throw new ValidationException("Email is taken, please choose another.");
            return _userRepository.Create(model.FullName, model.Email, model.IsAdmin);
        }
        catch (ValidationException e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException?.Message);
            throw new Exception("Could not create a new user");
        }
    }
    
    // This will be used when an admin updates another user
    public User Update(UpdateUserCommandModel model)
    {
        var userId = model.Id; // Id of our user to be updated
        var fullname = model.FullName; // full name of our user to be updated
        var email = model.Email; // email of user to be updated
        var isAdmin = model.IsAdmin; // admin status of updated user
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
    
    public User? GetById(int id)
    {
        return _userRepository.GetById(id);
    }
    
    public IEnumerable<User> GetAll()
    {
        return _userRepository.GetAll();
    }
    
    public UserDetailQueryModel? GetDetails(int id)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return null;

        return new UserDetailQueryModel
        {
            Id = user.Id,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            FullName = user.FullName
        };
    }
    
    public IEnumerable<UserOverviewQueryModel> GetOverview()
    {
        return _userRepository.GetAll().Select(user => new UserOverviewQueryModel()
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email
        });
    }
    
}