interface LabelProps {
  children: string;
  className?: string;
}

const Label = ({ children, className = "" }: LabelProps): JSX.Element => (
  <div className={"text-center " + className}>
    <span className="px-3 pt-2 pb-1 text-base uppercase border-2 rounded-full border-primary sm:text-2xl font-important">
      {children}
    </span>
  </div>
);

export default Label;
