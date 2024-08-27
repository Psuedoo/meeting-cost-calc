"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Attendee,
  calculateMeetingCost,
  cleanUserName,
  parseMeetingDuration,
  Person,
} from "@/lib/utils";
import SalaryUpload from "@/app/components/salary";
import { AttendanceReportUpload, AttendeeTable } from "@/app/components/attendance";

export default function Home() {
  const [salaryData, setSalaryData] = useState<Person[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [meetingDuration, setMeetingDuration] = useState<number>(0);
  const [meetingCost, setMeetingCost] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");

  const handleCalculate = () => {
    const cost = calculateMeetingCost(attendees, meetingDuration, salaryData);
    const roundedCost = Math.round((cost + Number.EPSILON) * 100) / 100;
    setMeetingCost(roundedCost);
  };

  const handleSetMeetingDuration = (meetingDuration: string) => {
    const parsedMeetingDuration = parseMeetingDuration(meetingDuration);
    setMeetingDuration(parsedMeetingDuration);
  };

  const parseAttendanceReport = (reportData: [string[]]) => {
    reportData.forEach((line) => {
      if (line[0] == "Meeting title") {
        setMeetingTitle(line[1]);
      }

      if (line[0] == "Average attendance time") {
        handleSetMeetingDuration(line[1]);
      }
    });

    const attendeesTableStart = (line: string[]) =>
      line[0] == "2. Participants";
    const attendeesTableEnd = (line: string[]) =>
      line[0] == "3. In-Meeting Activities";

    const attendeesStart = reportData.findIndex(attendeesTableStart) + 2;
    const attendeesEnd = reportData.findIndex(attendeesTableEnd) - 1;
    const attendees: Attendee[] = [];

    reportData
      .slice(attendeesStart, attendeesEnd)
      .forEach((attendee: string[]) => {
        attendees.push({
          name: cleanUserName(attendee[0]),
          email: attendee[4],
        });
      });

    setAttendees(attendees);
    handleCalculate();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl pb-10">Welcome to the site!</h1>
      <div className="flex flex-col items-center">
        <h1 className="text-xl pt-5">Add Meeting Details</h1>
        <SalaryUpload setSalaryData={setSalaryData} />
      </div>
      <div className="flex flex-col items-center">
        <AttendanceReportUpload parseAttendanceReport={parseAttendanceReport} />
      </div>
      {meetingTitle ? <h1>{meetingTitle}</h1> : <></>}
      {meetingDuration ? (
        <div>
          <p>Meeting Duration: {meetingDuration}</p>
          {/* TODO: Auto calculate meeting cost */}
          <Button onClick={() => handleCalculate()}>
            Calculate Meeting Cost
          </Button>
          {meetingCost ? <p>This meeting costs: ${meetingCost}</p> : <></>}
        </div>
      ) : (
        <></>
      )}
      <AttendeeTable attendees={attendees} setAttendees={setAttendees} />
    </main>
  );
}
