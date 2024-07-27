'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import MyCard from "@/components/shared/card";


export default function Home() {
    const [page, setPage] = useState(1);
    const { events, loading } = useEvents(page, 9); 

    const nextPage = () => {
        setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };


    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
                <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
                    <div className="flex flex-col justify-center gap-8">
                        <h1 className="md:h2-bold text-center h3-bold md:text-start">
                            Узнайте о предстоящих IT мероприятиях по всему миру, подходящих именно вам в один клик!
                        </h1>
                        {/* 
                        <p>Узнайте о предстоящих хакатонах, ИТ-конференциях и технических мероприятиях по всему миру, подходящих именно вам.</p>
                        <p className="p-regular-16 md:p-regular-18">
                            ITEventsAI — это ваш персональный помощник, который самостоятельно ищет и предлагает IT ивенты, подходящие именно вам. Приложение автоматически добавляет выбранные события в ваш календарь и помогает организовать задачи до дедлайна.
                        </p> */}
                        <Button size="lg" asChild className="button w-full sm:w-fit">
                            <Link href="/search">
                                Начать
                            </Link>
                        </Button>
                    </div>

                    <Image
                        src="/assets/images/landing.jpg"
                        alt="hero"
                        width={1000}
                        height={1000}
                        className="max-h-[70vh] object-contain object-center 2xl:max-h-[80vh] rounded-xl"
                    />
                </div>
            </section>

            <section id="events" className="wrapper flex flex-col gap-8 md:gap-12 py-12 md:py-24 lg:py-20">
                {/* <h2 className="h2-bold text-primary-500">Не упусти свои возможности...</h2> */}
                
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Предстоящие мероприятия</div>
                <h2 className="text-3xl font-bold sm:text-5xl text-primary-500">Не упусти свои возможности</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed p-medium">
                Наш сайт предназначен не только для разработчиков, но и для всех, кто работает в IT сфере!
                </p>
                {/* <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Наш сайт предназначен не только для разработчиков, но и для всех, кто работает в IT сфере: инженеров, SAP и системных администраторов, менеджеров по продуктам, QAS и UX/UI дизайнеров!
                </p> */}
              </div>
            </div>
                {loading ? (
                  //   <div className="flex items-center justify-center">
                  //   <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
                  // </div>
                  <div className="flex items-center justify-center h-full">
      <div className="relative w-20 h-20 animate-spin">
        <div className="absolute bg-primary rounded-full" />
        <div className="absolute bg-background rounded-full flex items-center justify-center">
          <RocketIcon className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.isArray(events) && events.map((hackathon) => (
                                <MyCard
                                    key={hackathon.title}
                                    _id = {hackathon._id}
                                    title={hackathon.title}
                                    location={hackathon.displayed_location ? hackathon.displayed_location.location : ''}
                                    thumbnail={hackathon.thumbnail_url || '/assets/images/default-image.jpg'}
                                    url={hackathon.url}
                                    prize={hackathon.prize_amount || ''} 
                                />
                            ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className={`px-4 py-2 bg-gray-200 rounded-md ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                onClick={prevPage}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={nextPage}
                                disabled={page === 12}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>


            {/* <section className="w-full py-12 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Featured Speakers</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Experts</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our events feature renowned industry leaders and innovators who share their insights and experiences.
                  Get inspired and learn from the best in the field.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="group">
                <CardHeader>
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Cloud Architect, Acme Inc.</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    John is a renowned cloud expert with over 15 years of experience in cloud infrastructure design and
                    implementation. He will share his insights on the future of cloud computing.
                  </p>
                </CardContent>
              </Card>
              <Card className="group">
                <CardHeader>
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">Sarah Anderson</h4>
                    <p className="text-sm text-muted-foreground">Cybersecurity Consultant, Secure Solutions</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sarah is a leading cybersecurity expert who has helped numerous organizations strengthen their
                    security posture. She will discuss the latest trends and best practices in enterprise cybersecurity.
                  </p>
                </CardContent>
              </Card>
              <Card className="group">
                <CardHeader>
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">Michael Kim</h4>
                    <p className="text-sm text-muted-foreground">DevOps Engineer, Acme Tech</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Michael is a seasoned DevOps engineer who has helped companies streamline their software delivery
                    processes. He will share his expertise on optimizing DevOps workflows and improving team
                    collaboration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

       
      
        </>
    );
}

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}
