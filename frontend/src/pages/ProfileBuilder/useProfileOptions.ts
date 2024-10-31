import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

type Option = { value: string; label: string };

export const useProfileOptions = () => {
  const [educationLevelOptions, setEducationLevelOptions] = useState<Option[]>([]);
  const [zoneOptions, setZoneOptions] = useState<Option[]>([]);
  const [subjectsOptions, setSubjectsOptions] = useState<Option[]>([]);
  const [ccaOptions, setCcaOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchEducationLevel: AxiosResponse<any> = await axios.get(
          `https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&limit=10000`
        );

        setEducationLevelOptions(
          Array.from(
            new Set(
              fetchEducationLevel.data.result.records.map(
                (school: any) => school.mainlevel_code
              )
            )
          ).map((code) => ({
            value: code as string,
            label: code as string,
          }))
        );

        const fetchZone: AxiosResponse<any> = await axios.get(
          `https://data.gov.sg/api/action/datastore_search?resource_id=d_688b934f82c1059ed0a6993d2a829089&limit=10000&fields=zone_code`
        );

        setZoneOptions(
          Array.from(
            new Set(fetchZone.data.result.records.map((school: any) => school.zone_code))
          ).map((code) => ({
            value: code as string,
            label: code as string,
          }))
        );

        const fetchSubjects: AxiosResponse<any> = await axios.get(
          `https://data.gov.sg/api/action/datastore_search?resource_id=d_f1d144e423570c9d84dbc5102c2e664d&limit=10000&fields=SUBJECT_DESC`
        );

        setSubjectsOptions(
          Array.from(
            new Set(fetchSubjects.data.result.records.map((school: any) => school.SUBJECT_DESC))
          ).map((desc) => ({
            value: desc as string,
            label: desc as string,
          }))
        );

        const fetchCca: AxiosResponse<any> = await axios.get(
          `https://data.gov.sg/api/action/datastore_search?resource_id=d_9aba12b5527843afb0b2e8e4ed6ac6bd&limit=10000&fields=cca_generic_name`
        );

        setCcaOptions(
          Array.from(
            new Set(fetchCca.data.result.records.map((school: any) => school.cca_generic_name))
          ).map((name) => ({
            value: name as string,
            label: name as string,
          }))
        );
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  return { educationLevelOptions, zoneOptions, subjectsOptions, ccaOptions };
};
