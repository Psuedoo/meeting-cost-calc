import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";
import { Attendee } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

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
  const removeAttendee = (attendeeName: Attendee) => {
    setAttendees(
      attendees.filter((innerAttendee) => {
        return attendeeName.email != innerAttendee.email;
      }),
    );
  };

  return (
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
                    {innerAttendee.name.firstName} {innerAttendee.name.lastName}
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
  );
}
