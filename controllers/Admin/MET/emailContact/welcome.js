export const welcomeMessage = function({email,password}){
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
     /* General Styles */
     body {
       font-family: Arial, sans-serif;
       background-color: #f4f4f4;
       margin: 0;
       padding: 0;
       color:black
     }
     .container {
       max-width: 600px;
       margin: 0 auto;
       padding: 20px;
       background-color: #f9f9f9;
     }
    
     /* Header Styles */
     .header {
       background-color: #007bff;
       color: #ffffff;
       text-align: left;
       padding: 0.1px 20px;
     }
     .content h1 {
       font-size: 32px;
       text-align: center;
     }
    
     /* Content Styles */
     .content {
       padding: 20px;
       background-color: #ffffff;
     }
     .message {
       font-size: 18px;
       line-height: 1;
     }
     .reset-button {
       display: inline-block;
       background-color: #007bff;
       color: #ffffff !important;
       font-size: 16px;
       padding: 10px 20px;
       text-decoration: none;
       border-radius: 5px;
       margin-top: 15px;
       margin-bottom: 15px;
     }
     .reset-button:hover {
       background-color: #0056b3;
       color: #ffffff;
     }
    
     /* Footer Styles */
     .footer {
       text-align: center;
       padding: 20px 0;
     }
     .footer p {
       font-size: 14px;
       color: #666;
     }
    </style>
    </head>
    <body>
    <div class="container">
     <div class="header">
       <h1>SSK Bharat</h1>
     </div>
     <div class="content">
       <h1>One Time Password </h1>
       <p class="message">Welcome to SSK Bharat-MET Protal.</p>
       <p class="message">Your Login Credentails are:-.</p>
       <p class="message">Email:${email} </p>
       <p class="message">Password:${password} </p>
       <p><sup class="message" style="font-size: 14px;">If you didn't initiate this request, you can safely ignore this email.</sup></p>
     </div>
     <div class="footer">
       <p>Best regards, Team SSK Bharat </p>
     </div>
    </div>
    </body>
    </html>
    `;
}