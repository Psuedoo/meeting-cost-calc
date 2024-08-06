"use client";

import Link from "next/link";
import { useCSVReader } from "react-papaparse";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  calculateMeetingCost,
  getEmployeesHourlyPays,
  Person,
} from "@/lib/utils";

export default function Home() {
  const { CSVReader } = useCSVReader();
  const [salaryData, setSalaryData] = useState<Person[]>([]);
  // Not needed yet
  // const [meetingData, setMeetingData] = useState();
  const myUsers = ["James Louis", "Kirby Smart"];

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="pb-10">Welcome to the site!</h1>
      <div className="flex flex-col items-center">
        <div className="border rounded-lg p-4 m-2">
          <CSVReader
            config={{ header: true }}
            onUploadAccepted={(results: any) => {
              setSalaryData(results.data);
              // This is currently where the calculation lives.
              // It is just here for testing.
              // Maybe it should be moved?
              // Maybe this is a fine place?
              calculateMeetingCost(myUsers, 3, results.data);
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
      <div></div>
    </main>
  );
}
