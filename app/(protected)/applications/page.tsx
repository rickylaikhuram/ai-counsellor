// // app/(protected)/applications/page.tsx
// import { getCurrentUser } from "@/libs/auth";
// import { redirect } from "next/navigation";

// export default async function ApplicationsPage() {
//   const user = await getCurrentUser();

//   // Check if user has locked at least one university
//   const hasLockedUniversity = await checkIfUserHasLockedUniversity(user.id);

//   if (!hasLockedUniversity) {
//     redirect("/universities"); // or show a message
//   }

//   return (
//     <div>
//       <h1>Application Guidance</h1>
//       {/* content */}
//     </div>
//   );
// }
