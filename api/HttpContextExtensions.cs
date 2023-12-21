using service;

namespace api;

public static class HttpContextExtensions
{
    // We attach session data here to access it in other parts of our application
    // This is implemented to work without cookies as we are using bearer tokens
    // httpContext.Items only exists for the duration of the current request, it is destroyed after.
     
    public static void SetSessionData(this HttpContext httpContext, SessionData data)
    {
        httpContext.Items["data"] = data;
    }

    public static SessionData? GetSessionData(this HttpContext httpContext)
    {
        return httpContext.Items["data"] as SessionData;
    }
    
    
}