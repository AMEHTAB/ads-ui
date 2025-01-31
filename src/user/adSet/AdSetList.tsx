import React from "react";
import { EnhancedTable, StandardRenderers } from "components/EnhancedTable";
import { Chip, LinearProgress } from "@mui/material";
import { Status } from "components/Campaigns/Status";
import _ from "lodash";
import { isAfterEndDate } from "util/isAfterEndDate";
import { adSetOnOffState } from "components/EnhancedTable/renderers";
import { AdvertiserCampaignsFragment } from "graphql/advertiser.generated";

interface Props {
  advertiserCampaigns?: AdvertiserCampaignsFragment | null;
  fromDate: Date | null;
}

interface ChipListProps {
  items?: Array<{ name: string }> | undefined | null;
  max?: number;
}

const ChipList: React.FC<ChipListProps> = ({ items, max }) => {
  if (!items) return null;

  const MAX_ITEMS = max ?? 10;

  const sorted = _.sortBy(items, "name");
  const max10 = _.take(sorted, MAX_ITEMS);

  return (
    <>
      {max10.map((item) => (
        <Chip
          key={item.name}
          label={item.name}
          size="small"
          variant="outlined"
          sx={{ mr: 1, marginY: "4px" }}
        />
      ))}

      {sorted.length > MAX_ITEMS && (
        <span>+ {sorted.length - MAX_ITEMS} more</span>
      )}
    </>
  );
};

export function AdSetList({ advertiserCampaigns, fromDate }: Props) {
  const campaigns = advertiserCampaigns?.campaigns ?? [];
  const mapAdSetName = campaigns.map((c) => ({
    adSets: c.adSets.map((a) => ({
      ...a,
      campaignName: c.name,
      campaignStart: c.startAt,
      campaignEnd: c.endAt,
      campaignId: c.id,
      campaignState: c.state,
      campaignSource: c.source,
      advertiserId: advertiserCampaigns?.id ?? "",
      fromDate,
    })),
  }));
  const adSets = _.flatMap(mapAdSetName, "adSets");

  const getState = (c: {
    campaignState: string;
    campaignEnd: string;
    state: string;
  }) => {
    return c.campaignState === "under_review"
      ? "under_review"
      : isAfterEndDate(c.campaignEnd)
      ? "completed"
      : c.state;
  };

  return (
    <EnhancedTable
      rows={adSets}
      initialSortColumn={7}
      initialSortDirection="desc"
      columns={[
        {
          title: "On/Off",
          value: (c) => c.state,
          extendedRenderer: (r) => adSetOnOffState(r),
          sx: { width: "10px" },
          sortable: false,
        },
        {
          title: "Ad Set Name",
          value: (c) => c.name || c.id.substring(0, 8),
        },
        {
          title: "State",
          value: (c) => getState(c),
          extendedRenderer: (r) => (
            <Status state={getState(r)} end={r.campaignEnd} />
          ),
        },
        {
          title: "Campaign Name",
          value: (c) => c.campaignName,
        },
        {
          title: "Type",
          value: (c) =>
            c.billingType === "cpm" ? "Impressions (CPM)" : "Clicks (CPC)",
        },
        {
          title: "Platforms",
          value: (c) => c.oses?.map((o: { name: string }) => o.name).join(", "),
          extendedRenderer: (r) => <ChipList items={r.oses} />,
        },
        {
          title: "Audiences",
          value: (c) =>
            c.segments?.map((o: { name: string }) => o.name).join(", "),
          extendedRenderer: (r) => (
            <ChipList
              items={r.segments}
              max={r.segments.join("").length > 100 ? 2 : 5}
            />
          ),
        },
        {
          title: "Created",
          value: (c) => c.createdAt,
          renderer: StandardRenderers.date,
        },
      ]}
    />
  );
}
