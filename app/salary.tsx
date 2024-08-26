import Link from "next/link";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";

export default function SalaryUpload({
  setSalaryData,
}: {
  setSalaryData: Function;
}) {
  const { CSVReader } = useCSVReader();

  return (
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
  );
}
