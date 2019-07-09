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

export const resetPasswordEmailTemplate = (newPassword, year) => `
<div style="background: #fff; width: 100%; height: 100%; padding: 3rem 0; font-family: 'Georgia'">
  <div style="width: 50vw; background: #FFF; display: block; margin: 0 auto; padding: 0; border: 1px solid #a00b40;">
    <div style=" background: #a00b40;">
      <h2 style="color: white; text-align: center; line-height: 10vh; background: #a00b40; margin: 0;">PropertyPro-Lite</h2>
    </div>
    <div style="text-align: center; padding: 0.5rem;">
      <p style="font-size: 1rem;">Hello there,</p>
      <p style="font-size: 1rem;">You recently requested a password reset
      on your PropertyPro-Lite account. Below is your new password be sure to change it after successful login.</p>
      <p style="padding: 0.3rem;"></p>
      <hr>
      <center>${newPassword}</center>
      <hr>
      <p style="padding: 0.3rem;"></p>
      <p style="font-size: 1rem;">PropertyPro-Lite © ${year}</p>
    </div>
  </div>
</div>`;

export default emailTemplate;
