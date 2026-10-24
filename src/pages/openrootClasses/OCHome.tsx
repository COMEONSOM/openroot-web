import Header from "./OCHeader";
import Banner from "./OCBanner";
import AvailableCourses from "./OCAvailableCourses";
import FreeContent from "./OCFreeContent";
import StudyMaterial from "./OCStudyMaterial";

// Main Openroot Classes page (/openroot-classes).
// The header is shown here only.
export default function OCHome() {
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