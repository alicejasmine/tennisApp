using Dapper;
using infrastructure.DataModels;
using Npgsql;

namespace infrastructure.Repositories;

public class UserRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public UserRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    // The purpose of this boolean is to check and make sure there will be no duplicate emails.
    // Since we use an email to log in, it is important they are unique.
    // in lieu of having two methods we are using isCreate
    // if true we will not use the userId (since it does not exist), and check only if the given email exists
    // if false, we are updating a user and in this case we require userId
    public bool IsEmailTaken(int userId, string email, bool isCreate)
    {
        if (isCreate)
        {
            using (var conn = _dataSource.OpenConnection())
            {
                return conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.users WHERE email = @email;",
                    new { email }) != 0;
            }  
        }
        else
        {
            using (var conn = _dataSource.OpenConnection())
            {
                return conn.ExecuteScalar<int>("SELECT COUNT(*) FROM tennis_app.users WHERE email = @email AND id != @userId;",
                    new { email, userId }) != 0;
            } 
        }
        
    }

   
    
    public User Create(string fullName, string email, bool admin)
    {
        
        
        const string sql = $@"
INSERT INTO tennis_app.users (full_name, email, admin)
VALUES (@fullName, @email, @admin)
RETURNING
    id as {nameof(User.Id)},
    full_name as {nameof(User.FullName)},
    email as {nameof(User.Email)},
    admin as {nameof(User.IsAdmin)}
    ;
";
        using var connection = _dataSource.OpenConnection();
        return connection.QueryFirst<User>(sql, new { fullName, email, admin });
    }
    
    
    public User Update(int id, string fullName, string email, bool admin)
    {
        const string sql = $@"
UPDATE tennis_app.users SET full_name = @fullName, email = @email, admin = @admin
WHERE id = @id
RETURNING
    id as {nameof(User.Id)},
    full_name as {nameof(User.FullName)},
    email as {nameof(User.Email)},
    admin as {nameof(User.IsAdmin)}
    ;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<User>(sql, new { id, fullName, email, admin });
        }
        
    }
    public User? GetById(int id)
    {
        const string sql = $@"
SELECT
    id as {nameof(User.Id)},
    full_name as {nameof(User.FullName)},
    email as {nameof(User.Email)},
    admin as {nameof(User.IsAdmin)}
FROM tennis_app.users
WHERE id = @id;
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirstOrDefault<User>(sql, new { id });
        }
        
    }

    public IEnumerable<User> GetAll()
    {
        const string sql = $@"
SELECT
    id as {nameof(User.Id)},
    full_name as {nameof(User.FullName)},
    email as {nameof(User.Email)},
    admin as {nameof(User.IsAdmin)}
FROM tennis_app.users
";
        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<User>(sql);
        }
        
    }


}