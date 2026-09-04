<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

/**
 * ProjectSeeder — placeholder OBM Construction projects.
 *
 * NOTE: All names, locations, figures, clients, and narrative text below are
 * PLACEHOLDERS provided so the design and layout can be reviewed. Replace
 * every field with REAL, verified OBM Construction project information before
 * launch. Do not publish placeholder content as fact.
 */
class ProjectSeeder extends Seeder
{
    /**
     * The placeholder projects in public display order.
     *
     * @var array<int, array<string, mixed>>
     */
    public array $projects = [
        [
            'slug' => 'bati-regional-market',
            'title' => 'Bati Regional Market',
            'category' => 'Commercial',
            'year' => '2021',
            'location' => 'Bati, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'A large-scale regional market development built to modern structural standards.',
            'overview' => 'A substantial commercial market development delivering modern trading floors, covered walkways and supporting infrastructure to connect local producers with buyers.',
            'challenge' => 'Coordinating construction across a high-traffic public site while maintaining access for daily trade and meeting rigorous structural codes.',
            'approach' => 'Phased construction kept the site operational, with our engineering team managing logistics, safety and quality through every stage.',
            'result' => 'A landmark regional market delivered on schedule, providing a durable and safe trading environment for the community.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Commercial'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Bati, Ethiopia'],
                ['key' => 'Year', 'value' => '2021'],
            ],
            'visual' => 'facade',
            'variant' => 0,
            'size' => 'tall',
            'featured' => true,
            'gallery' => [
                ['visual' => 'road', 'variant' => 0, 'alt' => 'Site context placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Structure placeholder'],
                ['visual' => 'facade', 'variant' => 0, 'alt' => 'Completed development placeholder'],
            ],
        ],
        [
            'slug' => 'keranyo-urban-roads',
            'title' => 'Keranyo Urban Roads',
            'category' => 'Infrastructure',
            'year' => '2022',
            'location' => 'Addis Ababa, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'Urban road corridor delivery including earthworks, asphalt and drainage works.',
            'overview' => 'An urban road corridor project covering earthworks, road base construction, asphalt surfacing and drainage systems across a dense city district.',
            'challenge' => 'Delivering construction within a live urban area with existing traffic, utilities and pedestrian movement to manage.',
            'approach' => 'Night-time working windows and careful traffic management kept disruption low while our crews progressed safely through each phase.',
            'result' => 'A smoother, safer road network delivered on time, improving connectivity and drainage for the district.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Infrastructure'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Addis Ababa, Ethiopia'],
                ['key' => 'Year', 'value' => '2022'],
            ],
            'visual' => 'road',
            'size' => 'wide',
            'gallery' => [
                ['visual' => 'road', 'variant' => 0, 'alt' => 'Roadworks placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Drainage works placeholder'],
            ],
        ],
        [
            'slug' => 'debre-zeit-commercial-complex',
            'title' => 'Debre Zeit Commercial Complex',
            'category' => 'Mixed-Use',
            'year' => '2020',
            'location' => 'Debre Zeit, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'A mixed-use development combining retail and office space with premium finishes.',
            'overview' => 'A mixed-use complex integrating ground-floor retail with modern office space above, finished to a premium commercial standard.',
            'challenge' => 'Sequencing a complex build that combines large public retail areas with technical office fit-outs under one coordinated programme.',
            'approach' => 'Integrated design and construction planning aligned structural, mechanical and finishing trades for seamless delivery.',
            'result' => 'A complete mixed-use development providing versatile, high-quality commercial space to the area.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Mixed-Use'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Debre Zeit, Ethiopia'],
                ['key' => 'Year', 'value' => '2020'],
            ],
            'visual' => 'facade',
            'variant' => 1,
            'size' => 'standard',
            'gallery' => [
                ['visual' => 'facade', 'variant' => 1, 'alt' => 'Exterior placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Internal structure placeholder'],
            ],
        ],
        [
            'slug' => 'yeka-residential-blocks',
            'title' => 'Yeka Residential Blocks',
            'category' => 'Residential',
            'year' => '2023',
            'location' => 'Addis Ababa, Ethiopia',
            'status' => 'In Progress',
            'client' => 'Client organisation placeholder',
            'description' => 'Multi-storey residential blocks delivered on schedule with structural integrity.',
            'overview' => 'A residential development of multi-storey apartment blocks engineered for safety, durability and comfortable living.',
            'challenge' => 'Delivering high-rise residential structure with consistent quality and strict safety at every level.',
            'approach' => 'A disciplined programme of structural works, finishing and inspections maintained quality control throughout the build.',
            'result' => 'Residential blocks progressing steadily, with structural works meeting all safety and engineering standards.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Residential'],
                ['key' => 'Status', 'value' => 'In Progress'],
                ['key' => 'Location', 'value' => 'Addis Ababa, Ethiopia'],
                ['key' => 'Year', 'value' => '2023'],
            ],
            'visual' => 'framework',
            'size' => 'tall',
            'gallery' => [
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Structural frame placeholder'],
                ['visual' => 'facade', 'variant' => 2, 'alt' => 'Building block placeholder'],
            ],
        ],
        [
            'slug' => 'bole-district-renewal',
            'title' => 'Bole District Renewal',
            'category' => 'Renovation',
            'year' => '2019',
            'location' => 'Addis Ababa, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'Award-grade renovation and structural strengthening of a commercial district.',
            'overview' => 'A structural strengthening and modernization programme renewing a commercial district while preserving its character.',
            'challenge' => 'Upgrading an occupied commercial area with structural strengthening works and minimal disruption to tenants.',
            'approach' => 'Careful engineering and phased works strengthened the structure while renovations upgraded the building envelope and interiors.',
            'result' => 'A revitalised, safer and more modern commercial district delivered without interrupting day-to-day operations.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Renovation'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Addis Ababa, Ethiopia'],
                ['key' => 'Year', 'value' => '2019'],
            ],
            'visual' => 'facade',
            'variant' => 2,
            'size' => 'standard',
            'gallery' => [
                ['visual' => 'facade', 'variant' => 2, 'alt' => 'Renovated facade placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Strengthening works placeholder'],
            ],
        ],
        [
            'slug' => 'sabeta-road-upgrade',
            'title' => 'Sabeta Road Upgrade',
            'category' => 'Infrastructure',
            'year' => '2021',
            'location' => 'Sabeta, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'A regional road upgrade improving access, safety and drainage.',
            'overview' => 'An upgrade of a regional road corridor improving surface quality, drainage and safe access for communities along the route.',
            'challenge' => 'Reconciling a long, dispersed works corridor with limited closures and varying ground conditions.',
            'approach' => 'Segmented delivery allowed progress along the corridor while keeping the road open and traffic moving safely.',
            'result' => 'A smoother, safer road delivered across the full corridor, improving regional connectivity.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Infrastructure'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Sabeta, Ethiopia'],
                ['key' => 'Year', 'value' => '2021'],
            ],
            'visual' => 'road',
            'size' => 'wide',
            'featured' => true,
            'gallery' => [
                ['visual' => 'road', 'variant' => 0, 'alt' => 'Corridor works placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Drainage placeholder'],
                ['visual' => 'facade', 'variant' => 1, 'alt' => 'Approach road placeholder'],
            ],
        ],
        [
            'slug' => 'metu-commercial-offices',
            'title' => 'Metu Commercial Offices',
            'category' => 'Commercial',
            'year' => '2022',
            'location' => 'Metu, Ethiopia',
            'status' => 'In Progress',
            'client' => 'Client organisation placeholder',
            'description' => 'A modern commercial office building with high-quality internal fit-out.',
            'overview' => 'A contemporary commercial office building combining a clean architectural facade with efficient, light-filled office floors.',
            'challenge' => 'Delivering a high-specification commercial shell-and-core alongside complex MEP and fit-out works.',
            'approach' => 'Tightly coordinated trade sequencing and quality inspections delivered the finishes to a consistent premium standard.',
            'result' => 'A modern, efficient office building progressing through fit-out with quality maintained throughout.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Commercial'],
                ['key' => 'Status', 'value' => 'In Progress'],
                ['key' => 'Location', 'value' => 'Metu, Ethiopia'],
                ['key' => 'Year', 'value' => '2022'],
            ],
            'visual' => 'facade',
            'variant' => 1,
            'size' => 'standard',
            'gallery' => [
                ['visual' => 'facade', 'variant' => 1, 'alt' => 'Office facade placeholder'],
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Fit-out structure placeholder'],
            ],
        ],
        [
            'slug' => 'awash-housing-neighbourhood',
            'title' => 'Awash Housing Neighbourhood',
            'category' => 'Mixed-Use',
            'year' => '2021',
            'location' => 'Awash, Ethiopia',
            'status' => 'Completed',
            'client' => 'Client organisation placeholder',
            'description' => 'A balanced mixed-use neighbourhood combining housing with retail ground floors.',
            'overview' => 'A thoughtfully planned neighbourhood pairing residential units with retail ground floors to create a liveable, connected community.',
            'challenge' => 'Balancing density, liveability and service delivery across a large mixed-use master plan.',
            'approach' => 'Phased neighbourhood delivery with coordinated civil works, landscaping and building construction.',
            'result' => 'A complete, cohesive neighbourhood delivered in phases with quality housing and ground-floor retail.',
            'scope' => [
                ['key' => 'Sector', 'value' => 'Mixed-Use'],
                ['key' => 'Status', 'value' => 'Completed'],
                ['key' => 'Location', 'value' => 'Awash, Ethiopia'],
                ['key' => 'Year', 'value' => '2021'],
            ],
            'visual' => 'framework',
            'size' => 'standard',
            'gallery' => [
                ['visual' => 'framework', 'variant' => 0, 'alt' => 'Neighbourhood structure placeholder'],
                ['visual' => 'road', 'variant' => 0, 'alt' => 'Site roads placeholder'],
            ],
        ],
    ];

    /**
     * Seed the application's projects with placeholder content.
     */
    public function run(): void
    {
        Project::query()->truncate();

        $order = 0;
        foreach ($this->projects as $project) {
            Project::create(array_merge($project, [
                'sort_order' => $order,
            ]));
            $order++;
        }
    }
}
