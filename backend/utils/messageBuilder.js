function buildMessage(template, replacements) {
  let message = template;

  Object.keys(replacements).forEach((key) => {
    message = message.replaceAll(`{{${key}}}`, replacements[key] || "");
  });

  return encodeURIComponent(message);
}

module.exports = buildMessage;
