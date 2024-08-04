'use client'
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


const ProfileComponent: React.FC = () => {
  const { user } = useAuth();
  console.log("User in Profile:", user); // Add this log to verify

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

//   return (
//     <div>
//       <h1>User Profile</h1>
//       {user ? (
//         <div>
//           <p>User ID: {user._id}</p>
//           <p>Email: {user.email}</p>
//           <p>Username: {user.username}</p>
//         </div>
//       ) : (
//         <p>Please log in to view your profile.</p>
//       )}
//     </div>
//   );
//};

return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src={user?.picture || '/assets/images/new-user.svg'} alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Name: {user?.name}</h1>
            <p className="text-muted-foreground">Email: {user?.email}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-muted-foreground">
            Спасибо за то что вошли в свой аккаунт! Мы это ценим!
          </p>
          
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold">Сохраненные: </h2>
          <p className="text-muted-foreground">
            В дальнейшем здесь должны будут отображаться сохраненные пользователем для себя мероприятия. Soon...
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <img
                  src="/assets/images/default-image.jpg"
                  width="300"
                  height="200"
                  alt="Project 1"
                  className="rounded-md"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium">Project 1</h3>
                  <p className="text-muted-foreground">A web application for managing tasks and projects.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <img
                  src="/assets/images/example1.jpg"
                  width="300"
                  height="200"
                  alt="Project 2"
                  className="rounded-md"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium">Project 2</h3>
                  <p className="text-muted-foreground">A mobile app for tracking fitness activities.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <img
                  src="/assets/images/default-image.jpg"
                  width="300"
                  height="200"
                  alt="Project 3"
                  className="rounded-md"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium">Project 3</h3>
                  <p className="text-muted-foreground">A web-based e-commerce platform.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}





export default ProfileComponent;
