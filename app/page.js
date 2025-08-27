"use client";

import Header from "./components/Header";
import Steps from "./components/Steps";
import Description from "./components/Description";
import Testimonials from "./components/Testimonials";
import GenerateBtn from "./components/GenerateBtn";

export default function Home({}) {
    return (
        <div className=" relative min-h-screen overflow-visible">
            <Header />
            <Steps />
            <Description />
            <Testimonials />
            <GenerateBtn />
        </div>
    );
}
