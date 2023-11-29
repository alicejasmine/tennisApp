using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Authentication;

namespace api.Filters;

public class RequireAuthentication : ActionFilterAttribute
{
    
    // This filter can be added to controllers or actions
    // It is used to only allow the endpoints to be accessed by authenticated users
    // add [RequireAuthentication] to a controller to protect it.
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.HttpContext.GetSessionData() == null) throw new AuthenticationException();
    }
}