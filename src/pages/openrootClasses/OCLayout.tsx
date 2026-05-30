import Header from "./OCHeader";
import Banner from "./OCBanner";
import AvailableCourses from "./OCAvailableCourses";
import FreeContent from "./OCFreeContent";
import StudyMaterial from "./OCStudyMaterial";

export default function OCLayout() {
  return (
    <>
      <Header />
      <Banner />
      <AvailableCourses />
      <StudyMaterial />
      <FreeContent />
    </>
  );
}