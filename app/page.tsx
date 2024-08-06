"use client";

import Link from "next/link";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateMeetingCost, Person } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-react";

export default function Home() {
  const { CSVReader } = useCSVReader();
  const [salaryData, setSalaryData] = useState<Person[]>([]);
  const [attendee, setAttendee] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [meetingDuration, setMeetingDuration] = useState<number>(1);
  const [meetingCost, setMeetingCost] = useState(0);
  // Not needed yet
  // const [meetingData, setMeetingData] = useState();
  const myUsers = ["James Louis", "Kirby Smart"];

  const handleOnFormSubmit = (e: any) => {
    e.preventDefault();

    setAttendees([attendee, ...attendees]);
    handleCalculate();
  };

  const removeAttendee = (attendeeName: string) => {
    setAttendees(
      attendees.filter((innerAttendee) => {
        return attendeeName != innerAttendee;
      })
    );
    handleCalculate();
  };

  const handleCalculate = () => {
    console.log(attendees);
    const cost = calculateMeetingCost(attendees, meetingDuration, salaryData);
    setMeetingCost(Math.round((cost + Number.EPSILON) * 100) / 100);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl pb-10">Welcome to the site!</h1>
      <div className="flex flex-col items-center">
        <h1 className="text-xl pt-5">Add Meeting Details</h1>

        <div className="border rounded-lg p-4 m-2">
          <CSVReader
            config={{ header: true }}
            onUploadAccepted={(results: any) => {
              setSalaryData(results.data);
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
            }: any) => (
              <>
                <div className="m-1">
                  <h1>Salaries CSV</h1>
                  <div>{acceptedFile && acceptedFile.name}</div>
                  <Button {...getRootProps()}>Browse file</Button>
                  {acceptedFile ? (
                    <Button variant="ghost" {...getRemoveFileProps()}>
                      Remove
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <p>
                  For Georgia state, you can download that{" "}
                  <Link
                    className="underline"
                    href="https://prod.insights.georgia.gov/views/AverageAgencySalaryRateReport/SalaryAnalysis?%3AshowAppBanner=false&%3Adisplay_count=n&%3AshowVizHome=n&%3Aorigin=viz_share_link&%3AisGuestRedirectFromVizportal=y&%3Aembed=y"
                  >
                    here
                  </Link>
                  .
                </p>
                <p>It will download as a zip.</p>
                <p>Unzip it and only upload the latest CSV report.</p>
                <ProgressBar />
              </>
            )}
          </CSVReader>
        </div>
      </div>
      {/* <div className="flex flex-col items-center">
        <div className="border rounded-lg p-4 m-2">
          <CSVReader
            onUploadAccepted={(results: any) => {
              console.log("---------------------------");
              console.log(results.data);
              console.log("---------------------------");
              setMeetingData(results);
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
            }: any) => (
              <>
                <div className="m-1">
                  <h1>Attendance Report CSV</h1>
                  <div>{acceptedFile && acceptedFile.name}</div>
                  <Button {...getRootProps()}>Browse file</Button>
                  {acceptedFile ? (
                    <Button variant="ghost" {...getRemoveFileProps()}>
                      Remove
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                <p>
                  For Microsoft365, you can use teams to export this report.
                  </p>
                  <ProgressBar />
                  </>
                  )}
                  </CSVReader>
                  </div>
                  </div> */}
      <div>
        <Label htmlFor="employees">Add Employees To Meeting</Label>
        <div className="flex">
          <form onSubmit={handleOnFormSubmit}>
            <Input
              id="employees"
              placeholder="John Smith"
              onChange={(e) => {
                setAttendee(e.target.value);
              }}
            />
            <Button type="submit">Add</Button>
          </form>
        </div>
      </div>
      <div>
        <Label htmlFor="meetinDuration">Meeting Duration in hours</Label>
        <Input
          id="meetingDuration"
          type="number"
          placeholder="1"
          onChange={(e) => {
            setMeetingDuration(Number(e.target.value));
          }}
        />
      </div>
      <div>
        {attendees.length > 0 ? (
          <div>
            <h1 className="text-xl mt-10">Attendees</h1>
            {attendees.map((innerAttendee, idx) => (
              <div className="flex justify-between" key={idx}>
                <p>{innerAttendee}</p>
                <TrashIcon
                  className="hover:cursor-pointer"
                  onClick={() => {
                    removeAttendee(innerAttendee);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
      <Button onClick={handleCalculate}>Calculate Meeting Cost</Button>
      {meetingCost ? <p>This meeting costs: ${meetingCost}</p> : <></>}
    </main>
  );
}
