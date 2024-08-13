"use client";

import Link from "next/link";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Attendee,
  calculateMeetingCost,
  cleanUserName,
  parseMeetingDuration,
  Person,
} from "@/lib/utils";
import { TrashIcon } from "lucide-react";

export default function Home() {
  const { CSVReader } = useCSVReader();
  const [salaryData, setSalaryData] = useState<Person[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [meetingDuration, setMeetingDuration] = useState<number>(0);
  const [meetingCost, setMeetingCost] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isShowingAttendees, setIsShowingAttendees] = useState(false);

  const removeAttendee = (attendeeName: Attendee) => {
    setAttendees(
      attendees.filter((innerAttendee) => {
        return attendeeName.email != innerAttendee.email;
      })
    );
    handleCalculate();
  };

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

    const attendeeTableStart = (line: string[]) =>
      line[0] == "3. In-Meeting Activities";
    const attendeeStart = reportData.findIndex(attendeeTableStart) + 2;
    const attendees: Attendee[] = [];

    reportData.slice(attendeeStart, -2).forEach((attendee: string[]) => {
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
      <div className="flex flex-col items-center">
        <div className="border rounded-lg p-4 m-2">
          <CSVReader
            onUploadAccepted={(results: any) => {
              parseAttendanceReport(results.data);
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
                <p>Please make sure to open the report in Excel and save it.</p>
                <p>This allows Excel to &quot;fix&quot; the report</p>
                <ProgressBar />
              </>
            )}
          </CSVReader>
        </div>
      </div>
      {/* Temporarily remove option to manually input attendees */}
      {/* <div>
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
        </div> */}
      {/* Remove this, but conditionally show meeting duration on report upload */}
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
      {/* <div>
        <Label htmlFor="meetingDuration">Meeting Duration in hours</Label>
        <Input
          id="meetingDuration"
          type="number"
          placeholder="1"
          onChange={(e) => {
            setMeetingDuration(Number(e.target.value));
          }}
        />
      </div> */}
      <div className="pt-2">
        {attendees.length > 0 ? (
          <div>
            <Button onClick={() => setIsShowingAttendees(!isShowingAttendees)}>
              {isShowingAttendees ? "Hide" : "Show"} Attendees
            </Button>
            {isShowingAttendees ? (
              <div>
                <h1 className="text-xl mt-10">Attendees</h1>
                {attendees.map((innerAttendee, idx) => (
                  <div className="flex justify-between" key={idx}>
                    <p>
                      {innerAttendee.name.firstName}{" "}
                      {innerAttendee.name.lastName}
                    </p>
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
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
