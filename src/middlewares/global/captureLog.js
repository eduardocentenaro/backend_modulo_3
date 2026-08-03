export function captureLog(request, response, next) {
  const timestamp = new Date().toISOString(); // pega a data e hora atual
  const userAgent = request.get("user-agent"); //

  const message = `
  [captureLog] 
     Horário:${timestamp} 
     Método: ${request.method} 
     Path: ${request.path}
     UserAgent: ${userAgent}
    `;

  console.log(message);

  next();
}
