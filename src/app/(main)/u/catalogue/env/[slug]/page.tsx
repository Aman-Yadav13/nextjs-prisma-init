"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEnvironmentDetailStore } from "@/store/environment-detail-store";
import { useAWSResourcesStore } from "@/store/aws-resources-store";
import { useAuthToken } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EnvironmentDetailPage() {
  const params = useParams();
  const envSlug = params.slug as string;
  const { environment, isLoading, error, fetchEnvironment } =
    useEnvironmentDetailStore();
  const {
    resources,
    fetchResources,
    isLoading: awsLoading,
    clearResources,
  } = useAWSResourcesStore();
  const token = useAuthToken();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [activeStaticTab, setActiveStaticTab] = useState("environment");
  const [activeCloudTab, setActiveCloudTab] = useState("aws-overview");

  useEffect(() => {
    fetchEnvironment(envSlug);
    // Clear AWS resources when environment changes
    clearResources();
  }, [envSlug, fetchEnvironment, clearResources]);

  useEffect(() => {
    if (environment && token && !resources && !awsLoading) {
      fetchResources(
        environment.cluster?.cluster_name || "",
        environment.account_id,
        environment.region,
        false,
        token,
      );
    }
  }, [environment, token]);

  const handleFetchAWSResources = async () => {
    if (!environment || !token) return;
    await fetchResources(
      environment.cluster?.cluster_name || "",
      environment.account_id,
      environment.region,
      forceRefresh,
      token,
    );
    if (resources) {
      setActiveCloudTab("aws-overview");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !environment) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error || "Environment not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {environment.slug}
          </h1>
          <p className="text-muted-foreground">
            {environment.customer_name} • {environment.environment}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleFetchAWSResources}
            disabled={awsLoading || !environment.cluster}
            variant="default"
          >
            {awsLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {awsLoading ? "Fetching..." : "Fetch AWS Resources"}
          </Button>
          {environment.web_url && (
            <Button
              variant="outline"
              onClick={() => window.open(environment.web_url!, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              GitLab
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={forceRefresh}
            onChange={(e) => setForceRefresh(e.target.checked)}
            className="h-4 w-4"
          />
          Force Refresh from AWS
        </label>
        {resources && (
          <Badge variant="default">
            Last synced:{" "}
            {new Date(resources.timestamp).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
          </Badge>
        )}
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Static Data:</strong> Information from GitLab configuration
          files (Environment, Cluster, Infrastructure, Data Store, Application
          tabs).
          <br />
          <strong>Dynamic Data:</strong> Real-time AWS resource information (AWS
          tabs - fetched on demand).
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">GitLab Metadata</h3>
          <Tabs
            value={activeStaticTab}
            onValueChange={setActiveStaticTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="cluster">Cluster</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="datastore">Data Store</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
            </TabsList>

            <TabsContent value="environment">
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Slug</TableCell>
                      <TableCell>{environment.slug}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Customer Name
                      </TableCell>
                      <TableCell>{environment.customer_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Environment</TableCell>
                      <TableCell>{environment.environment}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Type</TableCell>
                      <TableCell>{environment.type || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Cloud Platform
                      </TableCell>
                      <TableCell className="uppercase">
                        {environment.cloud_platform}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Account ID</TableCell>
                      <TableCell className="font-mono">
                        {environment.account_id}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Region</TableCell>
                      <TableCell>{environment.region}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Created At (Git)
                      </TableCell>
                      <TableCell>
                        {environment.created_at_git || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Updated At (Helm)
                      </TableCell>
                      <TableCell>
                        {environment.updated_at_helm || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">GitLab URL</TableCell>
                      <TableCell>
                        {environment.web_url ? (
                          <a
                            href={environment.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {environment.web_url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="cluster">
              {environment.cluster ? (
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Cluster Name
                        </TableCell>
                        <TableCell>
                          {environment.cluster.cluster_name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Helm Branch
                        </TableCell>
                        <TableCell>
                          {environment.cluster.helm_branch || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Dashboard URL
                        </TableCell>
                        <TableCell>
                          {environment.cluster.dashboard_url ? (
                            <a
                              href={environment.cluster.dashboard_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {environment.cluster.dashboard_url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Ingress Host
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.cluster.ingress_host || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Has Ingress
                        </TableCell>
                        <TableCell>
                          {environment.cluster.has_ingress ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Has Autoscaler
                        </TableCell>
                        <TableCell>
                          {environment.cluster.has_autoscaler ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No cluster data available
                </p>
              )}
            </TabsContent>

            <TabsContent value="infrastructure">
              {environment.infrastructure ? (
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          VPC ID
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.infrastructure.vpc_id || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">VPC CIDR</TableCell>
                        <TableCell className="font-mono">
                          {environment.infrastructure.vpc_cidr || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Subnet App 1
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.infrastructure.subnet_app_1 || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Subnet App 2
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.infrastructure.subnet_app_2 || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Subnet App 3
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.infrastructure.subnet_app_3 || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Instance Type
                        </TableCell>
                        <TableCell>
                          {environment.infrastructure.instance_type || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Multi-AZ</TableCell>
                        <TableCell>
                          {environment.infrastructure.is_multi_az
                            ? "Yes"
                            : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Resource Group
                        </TableCell>
                        <TableCell>
                          {environment.infrastructure.resource_group || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No infrastructure data available
                </p>
              )}
            </TabsContent>

            <TabsContent value="datastore">
              {environment.data_store ? (
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          RDS Endpoint
                        </TableCell>
                        <TableCell className="font-mono break-all">
                          {environment.data_store.rds_endpoint || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">RDS Class</TableCell>
                        <TableCell>
                          {environment.data_store.rds_class || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ElasticSearch Endpoint
                        </TableCell>
                        <TableCell className="font-mono break-all">
                          {environment.data_store.es_endpoint || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ElasticSearch Instance
                        </TableCell>
                        <TableCell>
                          {environment.data_store.es_instance || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Redis Host
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.data_store.redis_host || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Redis Cluster ID
                        </TableCell>
                        <TableCell>
                          {environment.data_store.redis_cluster_id || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No data store information available
                </p>
              )}
            </TabsContent>

            <TabsContent value="application">
              {environment.application ? (
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          ECM Replicas
                        </TableCell>
                        <TableCell>
                          {environment.application.ecm_replicas ?? "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ECM CPU Limit
                        </TableCell>
                        <TableCell>
                          {environment.application.ecm_cpu_limit || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ECM Memory Limit
                        </TableCell>
                        <TableCell>
                          {environment.application.ecm_mem_limit || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ECM Java Opts
                        </TableCell>
                        <TableCell>
                          {environment.application.ecm_java_ops ? (
                            <pre className="whitespace-pre-wrap font-mono text-xs bg-muted p-2 rounded">
                              {environment.application.ecm_java_ops}
                            </pre>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          UserMS Replicas
                        </TableCell>
                        <TableCell>
                          {environment.application.userms_replicas ?? "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          PAM Enabled
                        </TableCell>
                        <TableCell>
                          {environment.application.pam_enabled ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          ISPM Enabled
                        </TableCell>
                        <TableCell>
                          {environment.application.ispm_enabled ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          APM Enabled
                        </TableCell>
                        <TableCell>
                          {environment.application.apm_enabled ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">APM URL</TableCell>
                        <TableCell>
                          {environment.application.apm_url ? (
                            <a
                              href={environment.application.apm_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {environment.application.apm_url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Log Bucket
                        </TableCell>
                        <TableCell className="font-mono">
                          {environment.application.log_bucket || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No application data available
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {resources && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Cloud Data</h3>
            <Tabs
              value={activeCloudTab}
              onValueChange={setActiveCloudTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="aws-overview">AWS Overview</TabsTrigger>
                {resources.eks && (
                  <TabsTrigger value="aws-eks">EKS</TabsTrigger>
                )}
                {resources.rds && (
                  <TabsTrigger value="aws-rds">RDS</TabsTrigger>
                )}
                {resources.elasticsearch && (
                  <TabsTrigger value="aws-es">ElasticSearch</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="aws-overview">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">EKS Cluster</h3>
                      <p className="text-sm text-muted-foreground">
                        {resources.eks ? "Available" : "Not Found"}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">RDS Instance</h3>
                      <p className="text-sm text-muted-foreground">
                        {resources.rds ? "Available" : "Not Found"}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">ElasticSearch</h3>
                      <p className="text-sm text-muted-foreground">
                        {resources.elasticsearch ? "Available" : "Not Found"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {resources.eks && (
                <TabsContent value="aws-eks">
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium w-1/3">
                              Cluster Name
                            </TableCell>
                            <TableCell>{resources.eks.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Status
                            </TableCell>
                            <TableCell>
                              <Badge>{resources.eks.status}</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Kubernetes Version
                            </TableCell>
                            <TableCell>
                              {resources.eks.kubernetes_version}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Endpoint
                            </TableCell>
                            <TableCell className="font-mono text-xs break-all">
                              {resources.eks.endpoint}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">ARN</TableCell>
                            <TableCell className="font-mono text-xs break-all">
                              {resources.eks.arn}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              VPC ID (AWS)
                            </TableCell>
                            <TableCell className="font-mono">
                              {resources.eks.vpc_id}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              VPC ID (GitLab)
                            </TableCell>
                            <TableCell className="font-mono">
                              {environment.infrastructure?.vpc_id || "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Total Nodes
                            </TableCell>
                            <TableCell>{resources.eks.total_nodes}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Subnet IDs
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {resources.eks.subnet_ids.map((subnet, i) => (
                                  <div key={i} className="font-mono text-xs">
                                    {subnet}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              NAT Gateway IPs
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {resources.eks.nat_gateway_ips.map((ip, i) => (
                                  <div key={i} className="font-mono text-xs">
                                    {ip}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    {resources.eks.node_groups.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Node Groups</h3>
                        {resources.eks.node_groups.map((ng, i) => (
                          <div key={i} className="rounded-md border mb-2">
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium w-1/3">
                                    Name
                                  </TableCell>
                                  <TableCell>{ng.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Status
                                  </TableCell>
                                  <TableCell>
                                    <Badge>{ng.status}</Badge>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Desired Size
                                  </TableCell>
                                  <TableCell>{ng.desired_size}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Min / Max Size
                                  </TableCell>
                                  <TableCell>
                                    {ng.min_size} / {ng.max_size}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Instance Types
                                  </TableCell>
                                  <TableCell>
                                    {ng.instance_types.join(", ") || "N/A"}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              {resources.rds && (
                <TabsContent value="aws-rds">
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">
                            Identifier
                          </TableCell>
                          <TableCell>{resources.rds.identifier}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>
                            <Badge>{resources.rds.status}</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Endpoint (AWS)
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {resources.rds.endpoint}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Endpoint (GitLab)
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {environment.data_store?.rds_endpoint || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Engine</TableCell>
                          <TableCell>
                            {resources.rds.engine}{" "}
                            {resources.rds.engine_version}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Instance Class
                          </TableCell>
                          <TableCell>{resources.rds.instance_class}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Allocated Storage
                          </TableCell>
                          <TableCell>
                            {resources.rds.allocated_storage_gb} GB
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Multi-AZ
                          </TableCell>
                          <TableCell>
                            {resources.rds.multi_az ? "Yes" : "No"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Storage Encrypted
                          </TableCell>
                          <TableCell>
                            {resources.rds.storage_encrypted ? "Yes" : "No"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            CPU Utilization
                          </TableCell>
                          <TableCell>
                            {resources.rds.performance.cpu_percent
                              ? `${resources.rds.performance.cpu_percent}%`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Free Storage
                          </TableCell>
                          <TableCell>
                            {resources.rds.performance.free_storage_gb
                              ? `${resources.rds.performance.free_storage_gb} GB`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Connections
                          </TableCell>
                          <TableCell>
                            {resources.rds.performance.connections ?? "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              )}

              {resources.elasticsearch && (
                <TabsContent value="aws-es">
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">
                            Domain Name
                          </TableCell>
                          <TableCell>
                            {resources.elasticsearch.domain_name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>
                            <Badge>{resources.elasticsearch.status}</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Version</TableCell>
                          <TableCell>
                            {resources.elasticsearch.version}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Endpoint (AWS)
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {resources.elasticsearch.endpoint || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Endpoint (GitLab)
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {environment.data_store?.es_endpoint || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Instance Type
                          </TableCell>
                          <TableCell>
                            {resources.elasticsearch.instance_type}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Instance Count
                          </TableCell>
                          <TableCell>
                            {resources.elasticsearch.instance_count}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Volume Size
                          </TableCell>
                          <TableCell>
                            {resources.elasticsearch.volume_size_gb} GB
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
