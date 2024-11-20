import React from "react"
import { HomePageCollection } from "./components/homePageCollection.js"


export function HomePage() {
  return (
    <>
      <HomePageBody />
    </>
  )
}
export function HomePageBody() {
  return (
    <>
      <HomePageCollection type="Bàn phím" />
      <HomePageCollection type="Chuột" />
      <HomePageCollection type="Màn hình" />
      {/* <Collection type="Tai nghe" /> */}
    </>
  )
}







