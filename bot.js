const fs = require("fs");
const hoy = new Date();
var SerialPort = require("serialport");
const TelegramBot = require("node-telegram-bot-api");
const url = "https://api.telegram.org/bot";
const token = "ponertutoken"; //Cambiar por el token de telegram
const bot = new TelegramBot(token, {
  polling: true,
});
var IdMiChat = 000;
var MiPuerto = new SerialPort("COM9", {
  baudRate: 9600,
  autoOpen: true,
});

MiPuerto.setEncoding("utf8");

MiPuerto.on("data", function (data) {
  console.log("Lo que entro es " + data);
  if (data[0] == "H") {
    console.log("Boton Precionado");
    bot.sendMessage(
      1709607424 + "@c.us",
      unescape("%u203C%uFE0F") +
        "Movimiento Detectado (Camara  " +
        ")\n" +
        " Hola Carlos \n" +
        unescape("\uD83D\uDC6E") +
        "Mi nombre es: BotDuino,Te muestro la lista de comandos que puedo reconocer:\n" +
        unescape("%uD83D%uDD17") +
        unescape("%uD83D%uDD13") +
        " Desactivar\n" +
        unescape("%uD83D%uDD0A") +
        " Encender ahora\n" +
        unescape("\uD83C\uDF21") +
        " Temperatura\n" +
        unescape("\uD83D\uDCF9") +
        " Video\n" +
        unescape("%uD83D%uDCF7") +
        " Foto\n" +
        unescape("%uD83D%uDD17") +
        " Enlace\n" +
        unescape("\uD83D\uDD34") +
        " Encender LED\n" +
        unescape("\uD83D\uDD35") +
        " Apagar LED"
    );
    camara();
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log("El ID del char" + chatId);
  var Mensaje = msg.text;
  console.log("Comando ingresado : " + Mensaje);
  if (Mensaje == "!ping") {
    // Send a new message to the same chat
    bot.sendMessage(chatId, "pong");
  } else if (Mensaje == unescape("%uD83D%uDD14")) {
    bot.sendMessage(
      chatId + "@c.us",
      unescape("\uD83D\uDEA8") +
        " Hola Carlos \n" +
        unescape("\uD83D\uDC6E") +
        "Mi nombre es: BotDuino,Te muestro la lista de comandos que puedo reconocer:\n" +
        unescape("%uD83D%uDD13") +
        " Desactivar\n" +
        unescape("%uD83D%uDD0A") +
        " Encender ahora\n" +
        unescape("\uD83C\uDF21") +
        " Temperatura\n" +
        unescape("\uD83D\uDCF9") +
        " Video\n" +
        unescape("%uD83D%uDCF7") +
        " Foto\n" +
        unescape("%uD83D%uDD17") +
        " Enlace\n" +
        unescape("\uD83D\uDD34") +
        " Encender LED\n" +
        unescape("\uD83D\uDD35") +
        " Apagar LED"
    );
  } else if (Mensaje == unescape("\uD83C\uDF21")) {
    MiPuerto.write("T");
    bot.sendMessage(chatId, "Temperatura!!!!!");
    MiPuerto.on("data", function (data) {
      console.log("Lo que entro es " + data);

      bot.sendMessage(chatId, data + "°C");
    });
  } else if (Mensaje == unescape("%uD83D%uDCF7")) {
    camara();
  } else if (Mensaje == unescape("\uD83D\uDCF9")) {
    link = "http://192.168.1.141/mjpeg/1"; //ip de la esp32cam
    bot.sendMessage(chatId, link);
  } else if (Mensaje == unescape("\uD83D\uDD34")) {
    MiPuerto.write("H");
    bot.sendMessage(chatId, "LED ENCENDIDO!!!!!!!!!");
  } else if (Mensaje == unescape("\uD83D\uDD35")) {
    console.log(Mensaje);
    MiPuerto.write("L");
    bot.sendMessage(chatId, "LED APAGADO!!!!!!!!!");
  } else if (Mensaje === unescape("%uD83D%uDD0A")) {
    MiPuerto.write("M");
    bot.sendMessage(chatId, "ALARMA ACTIVADA!!!!!!");
    bot.sendMessage(
      chatId,
      unescape("%uD83D%uDD0A") +
        unescape("%uD83D%uDD0A") +
        unescape("%uD83D%uDD0A")
    );
  } else if (Mensaje == unescape("%uD83D%uDCFA")) {
  } else {
    bot.sendMessage(chatId, "NOse recnococe el comando!!!!!!!!!");
    console.log(Mensaje);
  }
});

function camara() {
  const hoy = new Date();
  const fecha = hoy.getFullYear() + "_" + hoy.getMonth() + "_" + hoy.getDay();
  const hora = hoy.getHours() + "_" + hoy.getMinutes() + "_" + hoy.getSeconds();
  const square = function captura() {
    console.log(fecha);
    console.log(hora);
    const webshot = require("node-webshot");
    const SITIO_WEB = "http://192.168.1.141/cam-hi.jpg";
    const OPCIONES = {
      customHeaders: {
        "Accept-Language": "es_LA", // Lenguaje de la página
      },
      shotSize: {
        width: "500",
        height: "500",
      },
      screenSize: {
        width: 1024, // Anchura de pantalla
        height: 500, // Altura de pantalla
      },
      // Indicar que "somos" Chrome en Windows
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
    };
    const cuandoSeTomeCaptura = (err) => {
      // Puede que haya un error
      if (err) {
        console.log("Lo siento, ocurrió un error: ", err);
      } else {
        console.log(
          `La página ${SITIO_WEB} ha sido guardada en ${NOMBRE_IMAGEN_SALIDA}`
        );
      }
    };
    webshot(SITIO_WEB, NOMBRE_IMAGEN_SALIDA, OPCIONES, cuandoSeTomeCaptura);
    return (ruta = NOMBRE_IMAGEN_SALIDA);
  };

  function envio() {
    const fetch = require("node-fetch");
    const fs = require("fs");
    const FormData = require("form-data");
    let readStream = fs.createReadStream("./" + ruta);
    let form = new FormData();
    form.append("photo", readStream);
    fetch(
      `https://api.telegram.org/bot185828888:BBGz-B7Zq_Rfgdgdf82282E/sendPhoto?chat_id=18822844552`, //https://api.telegram.org/bot"+token+"/sendPhoto?chat_id="+chat_id
      {
        method: "POST",
        body: form,
      }
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    return (imagen = ruta);
  }
  var NOMBRE_IMAGEN_SALIDA = "salida_" + hora + ".png";
  var ruta = square(NOMBRE_IMAGEN_SALIDA);
  console.log(ruta);
  setTimeout(envio, 3000);
  var y = envio(ruta);
  console.log(y);
}
