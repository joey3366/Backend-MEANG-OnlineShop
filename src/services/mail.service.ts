import Mail from "nodemailer/lib/mailer";
import { transport } from "../config/mailer";
import { IMailOptions } from "../interfaces/email.interface";

class MailService{
    send(mail: IMailOptions){
        return new Promise((resolve, reject) =>
        transport.sendMail(
          {
            from: '"🦈 SharkGames 🎮" <SharkGamesjs@gmail.com>',
            to: mail.to,
            subject: mail.subject,
            html: mail.html,
          },
          (error, _) => {
            error
              ? reject({ status: false, message: error })
              : resolve({
                  status: true,
                  message: "Email correctamente enviado a " + mail.to,
                  mail,
                });
          }
        )
      );
    }
}

export default MailService;