// export default function MessageStatus({ message, isOwn }) {
//   if (!isOwn) return null;

//   let icon = "✓";
//   if (message.seen || message.status === "seen") icon = "✓✓";
//   else if (message.delivered || message.status === "delivered") icon = "✓✓";

//   const className =
//     message.seen || message.status === "seen"
//       ? "message-status message-status--seen"
//       : "message-status";

//   return <span className={className}>{icon}</span>;
// }

// export default function MessageStatus({ message, isOwn }) {
//   console.log("MessageStatus:", {
//     id: message._id,
//     seen: message.seen,
//     status: message.status,
//     delivered: message.delivered,
//   });

//   if (!isOwn) return null;

//   let icon = "✓";

//   if (message.seen || message.status === "seen") {
//     icon = "✓✓";
//   } else if (message.delivered || message.status === "delivered") {
//     icon = "✓✓";
//   }

//   return <span>{icon}</span>;
// }
export default function MessageStatus({ message, isOwn }) {
  if (!isOwn) return null;

  let icon = "✓";

  if (message.seen || message.status === "seen") {
    icon = "✓✓";
  } else if (message.delivered || message.status === "delivered") {
    icon = "✓✓";
  }

  const className =
    message.seen || message.status === "seen"
      ? "message-status message-status--seen"
      : "message-status";

  console.log(className);

  return <span className={className}>{icon}</span>;
}