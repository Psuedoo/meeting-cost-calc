import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface Person {
  name: string;
  fiscal_year?: string;
  agency?: string;
  job_title?: string;
  base_salary?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const cleanUserName = (name: string) => {
  if (name.includes(",")) {
    return { firstName: name.split(", ")[1], lastName: name.split(", ")[0] };
  }

  return { firstName: name.split(" ")[0], lastName: name.split(" ")[1] };
};

export const searchUser = (name: string, salaryDataset: Person[]) => {
  if (!salaryDataset) {
    throw Error("No salaryDataset");
  }

  const cleanedName = cleanUserName(name);

  const firstNameFiltered = salaryDataset.filter((employee: Person) => {
    if (!employee.name) {
      return;
    }
    return employee.name.includes(cleanedName.firstName);
  });
  const possibleUsers = firstNameFiltered.filter((employee: Person) => {
    if (!employee.name) {
      return;
    }
    return employee.name.includes(cleanedName.lastName);
  });
  const sortedPossibleUsers = possibleUsers.sort(
    (a: Person, b: Person) => Number(b.fiscal_year) - Number(a.fiscal_year)
  );
  const selectedUser = sortedPossibleUsers[0];
  return selectedUser;
};

export const searchEmployees = (
  employeeNames: string[],
  salaryDataset: Person[]
) => {
  const foundUsers: Person[] = [];
  employeeNames.forEach((employeeName: string) => {
    foundUsers.push(searchUser(employeeName, salaryDataset));
  });
  return foundUsers;
};

export const getEmployeeSalary = (
  employeeName: string,
  salaryDataset: Person[]
) => {
  const user = searchUser(employeeName, salaryDataset);
  return Number(user.base_salary);
};

export const getEmployeesSalaries = (
  users: string[],
  salaryDataset: Person[]
) => {
  const foundUsers = searchEmployees(users, salaryDataset);
  const salaries: number[] = foundUsers.map((employee) =>
    Number(employee.base_salary)
  );
  return salaries;
};

export const calculateHourlyPay = (salary: number) => {
  // This number is calculated by:
  // (8 * 260) - (11 * 8)
  // 8 hours a day
  // 260 weekdays a year
  // 11 federal holidays
  const yearlyHoursWorked = 1992;
  const hourlyPay = salary / yearlyHoursWorked;
  return hourlyPay;
};

export const getEmployeeHourlyPay = (
  employeeName: string,
  salaryDataset: Person[]
) => {
  const salary = getEmployeeSalary(employeeName, salaryDataset);
  return calculateHourlyPay(salary);
};

export const getEmployeesHourlyPays = (
  employees: string[],
  salaryDataset: Person[]
) => {
  const hourlyPays: number[] = employees.map((employee) => {
    return getEmployeeHourlyPay(employee, salaryDataset);
  });

  return hourlyPays;
};

export const calculateMeetingCost = (
  employees: string[],
  meetingDuration: number, // TODO: Change this to a string and parse it, like 1h 2m 10s
  salaryDataset: Person[]
) => {
  let sumOfHourlyPays = 0;
  const hourlyPays = getEmployeesHourlyPays(employees, salaryDataset);
  hourlyPays.forEach((pay) => {
    sumOfHourlyPays += pay;
  });

  const cost = meetingDuration * sumOfHourlyPays;
  console.log(cost);
  return cost;
};
