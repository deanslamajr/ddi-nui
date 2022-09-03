// TODO finish implementing this type
// based off of '~/utils/reddit.ts'
export type reddit = [
  {
    kind: "Listing";
    data: {
      after: null;
      dist: 1 | null;
      modhash: "";
      geo_filter: "";
      children: [
        {
          kind: "t3";
        }
      ];
      before: null;
    };
  }
];
