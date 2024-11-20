import React from "react";
import { HomePageCollection } from "./components/homePageCollection.js";

export function HomePage() {
  return (
    <>
      <HomePageBody />
    </>
  );
}

export function HomePageBody() {
  return (
    <div className="space-y-8">
      <HomePageCollection type="Bàn phím" />
      <HomePageCollection type="Chuột" />
      <HomePageCollection type="Màn hình" />
    </div>
  );
}
