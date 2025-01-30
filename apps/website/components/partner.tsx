import NextImage from "next/image";
import { ReactNode } from "react";

import { IPartner } from "../lib/partner";
import Label from "./shared/label";
import Link from "./shared/link";

export interface PartnerProps {
  label: string;
  className?: string;
  list: IPartner[];
}

const Partner = ({ label, className, list }: PartnerProps): ReactNode => (
  <div className={className}>
    <Label>{label}</Label>
    <div className="mt-4 flex flex-wrap justify-center">
      {list?.map((partner, index) => (
        <span className="p-3" key={index}>
          <Link href={partner.link}>
            <NextImage
              src={partner.logo.url}
              width={partner.logo.width}
              height={partner.logo.height}
              alt={partner.logo.alt}
              className="invert-partner"
            />
          </Link>
        </span>
      ))}
    </div>
  </div>
);

export default Partner;
