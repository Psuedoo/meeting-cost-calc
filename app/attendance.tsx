import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { Attendee } from "@/lib/utils";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AttendanceReportUpload({
  parseAttendanceReport,
}: {
  parseAttendanceReport: Function;
}) {
  const { CSVReader } = useCSVReader();
  return (
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
            <p>For Microsoft365, you can use teams to export this report.</p>
            <p>Please make sure to open the report in Excel and save it.</p>
            <p>This allows Excel to &quot;fix&quot; the report</p>
            <ProgressBar />
          </>
        )}
      </CSVReader>
    </div>
  );
}

export function AttendeeTable({
  attendees,
  setAttendees,
}: {
  attendees: Attendee[];
  setAttendees: Function;
}) {
  const [isShowingAttendees, setIsShowingAttendees] = useState(false);

  // TODO: Implement removing of attendees
  const removeAttendee = (attendeeName: Attendee) => {
    setAttendees(
      attendees.filter((innerAttendee) => {
        return attendeeName.email != innerAttendee.email;
      }),
    );
  };

  return (
    <div className="pt-2">
      <Button onClick={() => setIsShowingAttendees(!isShowingAttendees)}>
        {isShowingAttendees ? "Hide" : "Show"} Attendees
      </Button>
      {isShowingAttendees ? (
        <Table>
          <TableCaption>Attendees</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>
                    {attendee.name.firstName} {attendee.name.lastName}
                  </TableCell>
                  <TableCell>{attendee.email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <></>
      )}
    </div>
  );
}
