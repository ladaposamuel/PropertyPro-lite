const emailTemplate = (priority, url, title, year) => `
<div style="background: #fff; width: 100%; height: 100%; padding: 3rem 0; font-family: 'Georgia'">
  <div style="width: 50vw; background: #FFF; display: block; margin: 0 auto; padding: 0; border: 1px solid #a00b40;">
    <div style=" background: #a00b40;">
      <h2 style="color: white; text-align: center; line-height: 10vh; background: #a00b40; margin: 0;">PropertyPro-Lite</h2>
    </div>
    <div style="text-align: center; padding: 0.5rem;">
      <p style="font-size: 1rem;">Hello there,</p>
      <p style="font-size: 1rem;">You have a new ${priority} message on PropertyPro-Lite</p>
      <p style="color:red; font-size: 1rem;"><strong>Message Title</strong>: ${title}</p>
      <p style="font-size: 1rem;">Login to view your message now</p>
      <p style="padding: 0.5rem;"></p>
      <a style="padding: 0.7rem 2rem; background: #00a98f; color: white; text-decoration: none; border-radius: 2px;" href="http://${url}">LOGIN</a>
      <p style="padding: 0.5rem;"></p> <hr/>
      <p style="font-size: 1rem;">PropertyPro-Lite © ${year}</p>
    </div>
  </div>
</div>`;

export const resetPasswordEmailTemplate = (url, resetToken, email, year) => `
<div style="background: #fff; width: 100%; height: 100%; padding: 3rem 0; font-family: 'Georgia'">
  <div style="width: 50vw; background: #FFF; display: block; margin: 0 auto; padding: 0; border: 1px solid #a00b40;">
    <div style=" background: #a00b40;">
      <h2 style="color: white; text-align: center; line-height: 10vh; background: #a00b40; margin: 0;">PropertyPro-Lite</h2>
    </div>
    <div style="text-align: center; padding: 0.5rem;">
      <p style="font-size: 1rem;">Hello there,</p>
      <p style="font-size: 1rem;">You recently requested a password reset
      on your PropertyPro-Lite account. Click the button below to reset it</p>
      <p style="padding: 0.3rem;"></p>
      <a style="padding: 0.7rem 2rem; background: #a00b40; color: white; text-decoration: none; border-radius: 2px;" href="http://${url}/resetpassword/?token=${resetToken}&email=${email}">RESET PASSWORD</a>
      <p style="padding: 0.3rem;"></p>
      <p style="padding: 1rem; font-size: 0.8rem;">If you did not request
      a password reset, please ignore this email.
      This password reset is only valid for the next 24 hours.</p>
      <hr /> <p style="padding: 0.3rem;"></p>
      <p style="padding: 1rem; font-size: 0.8rem;">If you're having trouble
      clicking the password button, copy and paste the URL below into your
      browser</p>
      <p style="padding: 1rem; font-size: 0.8rem;">Link: http://${url}/resetpassword/?token=${resetToken}&email=${email}</p>
      <p style="padding: 0.3rem;"></p> <hr/>
      <p style="font-size: 1rem;">PropertyPro-Lite © ${year}</p>
    </div>
  </div>
</div>`;

export default emailTemplate;
