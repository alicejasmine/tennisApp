using System.Security.Cryptography;

namespace service.Password;

public abstract class PasswordHashAlgorithm // common interface for various hashing algorithms
{
    const string PreferredAlgorithmName = Argon2idPasswordHashAlrgoritm.Name;

    
    //used to dynamically create instances of our concrete subclass.
    //this method is responsible for instantiating the password hashing algorithm at runtime.
    public static PasswordHashAlgorithm Create(string algorithmName = PreferredAlgorithmName)
    {
        switch (algorithmName)
        {
            case Argon2idPasswordHashAlrgoritm.Name:
                return new Argon2idPasswordHashAlrgoritm();
            default:
                throw new NotImplementedException();
        }
    }

    public abstract string GetName();
    
    public abstract string HashPassword(string password, string salt);

    public abstract bool VerifyHashedPassword(string password, string hash, string salt);

    public string GenerateSalt()
    {
        return Encode(RandomNumberGenerator.GetBytes(128));
    }
    
    protected byte[] Decode(string value)
    {
        return Convert.FromBase64String(value);
    }

    protected string Encode(byte[] value)
    {
        return Convert.ToBase64String(value);
    }
}