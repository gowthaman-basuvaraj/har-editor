import React from "react";
import { CommandBar } from "@fluentui/react";
import { useService } from "use-service";

const FILTERS = [
  { key: "keep-json", name: "JSON", icon: "Code", types: ["application/json"] },
  { key: "keep-xhr", name: "XHR", icon: "Switch", types: ["application/json", "application/xml", "text/plain", "text/html"] },
  { key: "keep-js", name: "JS", icon: "JavaScriptLanguage", types: ["javascript"] },
  { key: "keep-css", name: "CSS", icon: "Color", types: ["text/css"] },
  { key: "keep-images", name: "Images", icon: "Photo2", types: ["image/"] },
  { key: "keep-fonts", name: "Fonts", icon: "Font", types: ["font/", "application/font", "application/x-font"] },
  { key: "keep-html", name: "HTML", icon: "FileHTML", types: ["text/html"] },
  { key: "keep-media", name: "Media", icon: "Video", types: ["video/", "audio/"] },
];

export function ActionBar(props) {
  const $har = useService("$har");
  const logs = $har.current.parsed.log;
  const [checkedFilters, setCheckedFilters] = React.useState({});
  const [checkedDomains, setCheckedDomains] = React.useState({});
  const [checkedStatuses, setCheckedStatuses] = React.useState({});

  const toggleFilter = (key) => {
    setCheckedFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilters = () => {
    const selectedTypes = FILTERS
      .filter(f => checkedFilters[f.key])
      .flatMap(f => f.types);
    if (selectedTypes.length > 0) {
      $har.filterByMimeTypes(selectedTypes);
      setCheckedFilters({});
    }
  };

  const commands = [
    {
      key: "reset",
      name: "Reset",
      iconProps: {
        iconName: "Undo"
      },
      onClick: () => $har.reset()
    }
  ];

  const hasChecked = Object.values(checkedFilters).some(Boolean);

  commands.push({
    key: "filter-by-type",
    name: "Keep only...",
    iconProps: { iconName: "Filter" },
    subMenuProps: {
      shouldFocusOnMount: true,
      items: [
        ...FILTERS.map(f => ({
          key: f.key,
          text: f.name,
          iconProps: { iconName: f.icon },
          canCheck: true,
          checked: !!checkedFilters[f.key],
          onClick: (ev) => {
            ev?.preventDefault();
            toggleFilter(f.key);
          }
        })),
        { key: "divider", itemType: 1 },
        {
          key: "apply-filter",
          text: "Apply",
          iconProps: { iconName: "CheckMark" },
          disabled: !hasChecked,
          onClick: applyFilters
        }
      ]
    }
  });
  const domains = [...new Set(
    logs.entries.map(e => {
      try { return new URL(e.request.url).host; } catch { return null; }
    }).filter(Boolean)
  )].sort();

  const toggleDomain = (domain) => {
    setCheckedDomains(prev => ({ ...prev, [domain]: !prev[domain] }));
  };

  const applyDomainFilter = () => {
    const selectedDomains = domains.filter(d => checkedDomains[d]);
    if (selectedDomains.length > 0) {
      $har.filterByDomains(selectedDomains);
      setCheckedDomains({});
    }
  };

  const hasDomainChecked = Object.values(checkedDomains).some(Boolean);

  commands.push({
    key: "filter-by-domain",
    name: "Keep domains...",
    iconProps: { iconName: "Globe" },
    subMenuProps: {
      shouldFocusOnMount: true,
      items: [
        ...domains.map(d => ({
          key: `domain-${d}`,
          text: d,
          canCheck: true,
          checked: !!checkedDomains[d],
          onClick: (ev) => {
            ev?.preventDefault();
            toggleDomain(d);
          }
        })),
        { key: "domain-divider", itemType: 1 },
        {
          key: "apply-domain-filter",
          text: "Apply",
          iconProps: { iconName: "CheckMark" },
          disabled: !hasDomainChecked,
          onClick: applyDomainFilter
        }
      ]
    }
  });

  const statuses = [...new Set(
    logs.entries.map(e => e.response.status)
  )].sort((a, b) => a - b);

  const toggleStatus = (status) => {
    setCheckedStatuses(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const applyStatusFilter = () => {
    const selectedStatuses = statuses.filter(s => checkedStatuses[s]);
    if (selectedStatuses.length > 0) {
      $har.filterByStatuses(selectedStatuses);
      setCheckedStatuses({});
    }
  };

  const hasStatusChecked = Object.values(checkedStatuses).some(Boolean);

  commands.push({
    key: "filter-by-status",
    name: "Keep statuses...",
    iconProps: { iconName: "StatusCircleCheckmark" },
    subMenuProps: {
      shouldFocusOnMount: true,
      items: [
        ...statuses.map(s => ({
          key: `status-${s}`,
          text: `${s}`,
          canCheck: true,
          checked: !!checkedStatuses[s],
          onClick: (ev) => {
            ev?.preventDefault();
            toggleStatus(s);
          }
        })),
        { key: "status-divider", itemType: 1 },
        {
          key: "apply-status-filter",
          text: "Apply",
          iconProps: { iconName: "CheckMark" },
          disabled: !hasStatusChecked,
          onClick: applyStatusFilter
        }
      ]
    }
  });

  if (props.selection && props.selection.length > 0) {
    commands.push({
      key: "multi-delete",
      name: "Delete",
      iconProps: {
        iconName: "Delete"
      },
      onClick: () => {
        $har.deleteRows(props.selection);
      }
    });
  }
  return <CommandBar items={commands} />;
}
