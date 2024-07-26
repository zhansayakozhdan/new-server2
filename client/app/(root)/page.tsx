'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useHackathons } from "@/hooks/useHackathons";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import MyCard from "@/components/shared/card";


export default function Home() {
    const [page, setPage] = useState(1);
    const { hackathons, loading } = useHackathons(page, 9); 

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
                        <h1 className="text-5xl font-bold">
                            Узнайте о предстоящих IT мероприятиях по всему миру, подходящих именно вам в один клик.
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
                        src="/assets/images/hero.png"
                        alt="hero"
                        width={1000}
                        height={1000}
                        className="max-h-[70vh] object-contain object-center 2xl:max-h-[80vh]"
                    />
                </div>
            </section>

            <section id="events" className="wrapper flex flex-col gap-8 md:gap-12 py-12 md:py-24 lg:py-20">
                {/* <h2 className="h2-bold text-primary-500">Не упусти свои возможности...</h2> */}
                
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Предстоящие мероприятия</div>
                <h2 className="text-3xl font-bold sm:text-5xl text-primary-500">Не упусти свои возможности</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Наш сайт предназначен не только для разработчиков, но и для всех, кто работает в IT сфере!
                </p>
                {/* <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Наш сайт предназначен не только для разработчиков, но и для всех, кто работает в IT сфере: инженеров, SAP и системных администраторов, менеджеров по продуктам, QAS и UX/UI дизайнеров!
                </p> */}
              </div>
            </div>
                {loading ? (
                    <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
                  </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {hackathons.map((hackathon) => (
                                <MyCard
                                    key={hackathon.title}
                                    _id = {hackathon._id}
                                    title={hackathon.title}
                                    location={hackathon.displayed_location.location}
                                    thumbnail={hackathon.thumbnail_url}
                                    url={hackathon.url}
                                    prize={hackathon.prize_amount}
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Past Events</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Highlights from Previous Events</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out some of the key moments and insights from our past IT events. Get a glimpse of the engaging
                  discussions, innovative presentations, and valuable networking opportunities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="group">
                <CardHeader>
                  <img
                    src="/placeholder.svg"
                    width="550"
                    height="310"
                    alt="Event Highlight"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h4 className="text-lg font-semibold">Cloud Computing Summit 2022</h4>
                  <p className="text-muted-foreground">
                    Experts discussed the latest advancements in cloud technology and infrastructure, sharing insights
                    on optimizing cloud deployments.
                  </p>
                </CardContent>
              </Card>
              <Card className="group">
                <CardHeader>
                  <img
                    src="/placeholder.svg"
                    width="550"
                    height="310"
                    alt="Event Highlight"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h4 className="text-lg font-semibold">Cybersecurity Symposium 2021</h4>
                  <p className="text-muted-foreground">
                    Industry leaders discussed the latest cybersecurity threats and shared best practices for
                    strengthening enterprise security.
                  </p>
                </CardContent>
              </Card>
              <Card className="group">
                <CardHeader>
                  <img
                    src="/placeholder.svg"
                    width="550"
                    height="310"
                    alt="Event Highlight"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  />
                </CardHeader>
                <CardContent>
                  <h4 className="text-lg font-semibold">DevOps Masterclass 2020</h4>
                  <p className="text-muted-foreground">
                    Experts shared their insights on optimizing DevOps workflows, improving team collaboration, and
                    accelerating software delivery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      
        </>
    );
}
