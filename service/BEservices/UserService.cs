using infrastructure.DataModels;
using infrastructure.Repositories;
using service.Models.Command;
using service.Models.Query;

namespace service;

public class UserService
{
    private readonly UserRepository _userRepository;

    public UserService(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public User Create(CreateUserCommandModel model)
    {
        return _userRepository.Create(fullName: model.FullName, email: model.Email);
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
            FullName = user.FullName
        });
    }
    
}