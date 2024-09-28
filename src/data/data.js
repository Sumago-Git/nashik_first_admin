import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const navigationLinks = [
  {
    id: 1,
    title: "RTO – Learner Driving License Holder Training",
    urlLink: "/learner-driving-license-holder-training",
    image: iconsImgs.home,
  },
  {
    id: 2,
    title: "RTO – Suspended Driving License Holders Training",
    urlLink: "/suspended-driving-license-holders-training",
    image: iconsImgs.budget,
  },
  {
    id: 3,
    title: "RTO – Training for School Bus Driver",
    urlLink: "/training-for-school-bus-driver",
    image: iconsImgs.plane,
  },
  {
    id: 4,
    title: "School Students Training – Group",
    urlLink: "/school-students-training-group",
    image: iconsImgs.wallet,
  },
  {
    id: 5,
    title: "College / Organization Training – Group",
    urlLink: "/college-organization-training–group",
    image: iconsImgs.bills,
  },
  {
    id: 6,
    title: "College / Organization Training – Individual",
    urlLink: "/college-organization-training–individual",
    image: iconsImgs.report,
  },
];

export const transactions = [
  {
    id: 11,
    name: "Sarah Parker",
    image: personsImgs.person_four,
    date: "23/12/04",
    amount: 22000,
  },
  {
    id: 12,
    name: "Krisitine Carter",
    image: personsImgs.person_three,
    date: "23/07/21",
    amount: 20000,
  },
  {
    id: 13,
    name: "Irene Doe",
    image: personsImgs.person_two,
    date: "23/08/25",
    amount: 30000,
  },
];

export const reportData = [
  {
    id: 14,
    month: "Jan",
    value1: 45,
    value2: null,
  },
  {
    id: 15,
    month: "Feb",
    value1: 45,
    value2: 60,
  },
  {
    id: 16,
    month: "Mar",
    value1: 45,
    value2: null,
  },
  {
    id: 17,
    month: "Apr",
    value1: 45,
    value2: null,
  },
  {
    id: 18,
    month: "May",
    value1: 45,
    value2: null,
  },
];

export const budget = [
  {
    id: 19,
    title: "Subscriptions",
    type: "Automated",
    amount: 22000,
  },
  {
    id: 20,
    title: "Loan Payment",
    type: "Automated",
    amount: 16000,
  },
  {
    id: 21,
    title: "Foodstuff",
    type: "Automated",
    amount: 20000,
  },
  {
    id: 22,
    title: "Subscriptions",
    type: null,
    amount: 10000,
  },
  {
    id: 23,
    title: "Subscriptions",
    type: null,
    amount: 40000,
  },
];

export const subscriptions = [
  {
    id: 24,
    title: "LinkedIn",
    due_date: "23/12/04",
    amount: 20000,
  },
  {
    id: 25,
    title: "Netflix",
    due_date: "23/12/10",
    amount: 5000,
  },
  {
    id: 26,
    title: "DSTV",
    due_date: "23/12/22",
    amount: 2000,
  },
];

export const savings = [
  {
    id: 27,
    image: personsImgs.person_one,
    saving_amount: 250000,
    title: "Pay kid bro’s fees",
    date_taken: "23/12/22",
    amount_left: 40000,
  },
];
